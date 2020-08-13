import { Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { UtilsService } from './utils.service';
import { User } from '../users/users.entity';
import * as dayjs from 'dayjs';
import * as dayOfYear from 'dayjs/plugin/dayOfYear';

dayjs.extend(dayOfYear);

@Resolver()
export class UtilsResolver {
  constructor(
    private readonly utilsService: UtilsService,
  ) {}


  @Query(returns => String)
  async calendarTodayDayNames(@CurrentUser() user: User): Promise<string> {
    const todayDay = dayjs().dayOfYear();
    const leapYear = dayjs().year() % 4 === 0;
    const index = todayDay - 1 - (leapYear && todayDay > 1 ? 1 : 0);

    return this.utilsService.getDayNames(index);
  }


  @Query(returns => String)
  async calendarTodayHoliday(@CurrentUser() user: User): Promise<string> {
    const todayDay = dayjs().dayOfYear();
    const leapYear = dayjs().year() % 4 === 0;
    const index = todayDay - 1 + (leapYear && todayDay > 1 ? 1 : 0);

    return this.utilsService.getHoliday(index);
  }
}
