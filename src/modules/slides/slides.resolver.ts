import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { ForbiddenException, forwardRef, Inject, UseGuards } from '@nestjs/common';

import { Slide } from './slides.entity';
import { NewSlideInput } from './dto/new-slide.input';
import { UpdateSlideInput } from './dto/update-slide.input';
import { SlidesService } from './slides.service';
import { RolesService } from '../roles/roles.service';
import { PermissionType } from '../roles/enums/permission-type.enum';
import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { ScreensService } from '../../screens/screens.service';

@Resolver(of => Slide)
export class SlidesResolver {
  constructor(
    private readonly slidesService: SlidesService,

    @Inject(forwardRef(() => ScreensService))
    private readonly screensService: ScreensService,

    @Inject(forwardRef(() => RolesService))
    private readonly rolesService: RolesService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Slide)
  async addSlide(
    @CurrentUser() user,
    @Args('newSlideData') newSlideData: NewSlideInput,
  ): Promise<Slide> {
    const screen = await this.screensService.findOneById(newSlideData.screenId);
    const currentUserRole = await this.rolesService.findOneUserRole(await user, screen);

    if (!currentUserRole) {
      throw new ForbiddenException();
    }

    let slide = new Slide();
    slide = Object.assign(slide, newSlideData);
    slide.screen = Promise.resolve(screen);

    return this.slidesService.create(slide);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Slide)
  async updateSlide(
    @CurrentUser() user,
    @Args('id') id: number,
    @Args('updateSlideData') updateSlideData: UpdateSlideInput,
  ): Promise<Slide> {
    const slide = await this.slidesService.findOneById(id);
    const currentUserRole = await this.rolesService.findOneUserRole(await user, await slide.screen);

    if (!currentUserRole) {
      throw new ForbiddenException();
    }

    return this.slidesService.updateOne(slide, updateSlideData);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Boolean)
  async deleteSlide(
    @CurrentUser() user,
    @Args('id') id: number,
  ): Promise<boolean> {
    const slide = await this.slidesService.findOneById(id);
    const currentUserRole = await this.rolesService.findOneUserRole(await user, await slide.screen);

    if (!currentUserRole) {
      throw new ForbiddenException();
    }

    const deleteResults = await this.slidesService.deleteOne(slide);
    return deleteResults.affected && deleteResults.affected > 0;
  }
}
