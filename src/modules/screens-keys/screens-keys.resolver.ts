import { Resolver, Args, Mutation, Query, Subscription } from '@nestjs/graphql';
import { ForbiddenException, Inject, UseGuards } from '@nestjs/common';
import { PubSubEngine } from 'graphql-subscriptions';
import { Int } from 'type-graphql';
import { isEqual } from 'lodash';

import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';

import { ScreenKey } from './screens-keys.entity';
import { ScreensKeysService } from './screens-keys.service';
import { createEntityInstance } from '../../shared/utils/create-entity-instance.util';
import { User } from '../users/users.entity';
import { Screen } from '../screens/screens.entity';
import { ScreensService } from '../screens/screens.service';
import { RolesService } from '../roles/roles.service';
import { ScreenKeyInput } from './dto/screen-key.input';
import { PubSubIterators } from '../../constants';

@Resolver(of => ScreenKey)
export class ScreensKeysResolver {
  constructor(
    private readonly screensKeysService: ScreensKeysService,
    private readonly screensService: ScreensService,
    private readonly rolesService: RolesService,
  ) {}

  @Subscription(returns => ScreenKeyInput, {
    filter: (payload, variables) => (
      isEqual(payload[PubSubIterators.SCREEN_KEY_ADDED], variables.screenKey)
    )
  })
  screenKeyAdded(
    @Args('screenKey') screenKey: ScreenKeyInput,
  ) {
    return this.screensKeysService.screenKeyAddedIterator();
  }

  @Query(returns => Screen)
  async screenByKey(
    @Args('screenKey') { screenId, privateKey, publicKey }: ScreenKeyInput,
  ): Promise<Screen> {
    const key = await this.screensKeysService.findOneByPrivateKeyAndScreenId(privateKey, screenId);
    const screen = await key?.screen;

    if (!key || screen.publicKey !== publicKey) {
      throw new ForbiddenException();
    }

    return screen;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => ScreenKey)
  async addScreenKey(
    @CurrentUser() currentUser: User,
    @Args({ name: 'screenId', type: () => Int }) screenId: number,
    @Args({ name: 'privateKey', type: () => String }) privateKey: string,
  ): Promise<ScreenKey> {
    const screen = await this.screensService.findOneByIdWithRelations(screenId, ['organization']);
    const currentUserRole = screen && await this.rolesService.findOneUserRole(currentUser, await screen.organization);

    if (!screen && !currentUserRole.isAdmin()) {
      throw new ForbiddenException();
    }

    const screenKeyData: Partial<ScreenKey> = {
      screen: Promise.resolve(screen),
      user: Promise.resolve(currentUser),
      privateKey,
    };

    const screenKey = createEntityInstance<ScreenKey>(ScreenKey, screenKeyData);
    const createdKey = await this.screensKeysService.create(screenKey);

    const subscriptionPayload: ScreenKeyInput = {
      privateKey,
      publicKey: screen.publicKey,
      screenId: screen.id,
    };
    await this.screensKeysService.screenKeyAddedPublish(subscriptionPayload);

    return createdKey;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Boolean)
  async deleteScreenKey(
    @CurrentUser() currentUser: User,
    @Args({ name: 'id', type: () => Int }) id: number,
  ): Promise<boolean> {
    const key = await this.screensKeysService.findOneByIdWithRelations(id, ['screen']);
    const screen = await this.screensService.findOneByIdWithRelations((await key.screen).id, ['organization']);
    const currentUserRole = screen && await this.rolesService.findOneUserRole(currentUser, await screen.organization);

    if (!screen && !currentUserRole.isAdmin()) {
      throw new ForbiddenException();
    }

    const deleteResults = await this.screensKeysService.deleteOneById(key.id);
    return deleteResults.affected && deleteResults.affected > 0;
  }
}
