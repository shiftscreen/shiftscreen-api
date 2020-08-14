import { Args, Query, Resolver } from '@nestjs/graphql';

import * as dayjs from 'dayjs';
import * as dayOfYear from 'dayjs/plugin/dayOfYear';
import { UtilsService } from './utils.service';
import { PredefinedQuotesType } from './enums/predefined-quotes.enum';
import { Quote } from './entities/quote.entity';

dayjs.extend(dayOfYear);

@Resolver()
export class UtilsResolver {
  constructor(
    private readonly utilsService: UtilsService,
  ) {}


  @Query(returns => String)
  async calendarTodayDayNames(): Promise<string> {
    const todayDay = dayjs().dayOfYear();
    const leapYear = dayjs().year() % 4 === 0;
    const index = todayDay - 1 - (leapYear && todayDay > 1 ? 1 : 0);

    return this.utilsService.getDayNames(index);
  }

  @Query(returns => String)
  async calendarTodayHoliday(): Promise<string> {
    const todayDay = dayjs().dayOfYear();
    const leapYear = dayjs().year() % 4 === 0;
    const index = todayDay - 1 + (leapYear && todayDay > 1 ? 1 : 0);

    return this.utilsService.getHoliday(index);
  }

  @Query(returns => [Quote])
  async quotePredefinedQuotes(
    @Args({ name: 'type', type: () => PredefinedQuotesType }) type: PredefinedQuotesType,
  ): Promise<Quote[]> {
    return this.utilsService.getQuotes(type);
  }
}
