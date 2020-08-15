import { Injectable } from '@nestjs/common';

import namesListText from '../../assets/names-days.txt';
import holidaysListText from '../../assets/holidays.txt';
import quotesMotivationalListText from '../../assets/quotes/motivational.txt';
import quotesBusinessListText from '../../assets/quotes/bussiness.txt';

import { Quote } from './entities/quote.entity';
import { PredefinedQuotesType } from './enums/predefined-quotes.enum';

const parseListText = (text: string): string[] => (
  text.split('\r\n').slice(0, -1)
);

@Injectable()
export class UtilsService {
  constructor() {}
  private namesList = parseListText(namesListText);
  private holidaysList = parseListText(holidaysListText);
  private quotesMotivationalList = parseListText(quotesMotivationalListText);
  private quotesBusinessList = parseListText(quotesBusinessListText);

  getDayNames(index: number): string {
    return this.namesList[index];
  }

  getHoliday(index: number): string {
    return this.holidaysList[index];
  }

  getQuotes(type: PredefinedQuotesType): Quote[] {
    const variants: Record<PredefinedQuotesType, string[]> = {
      [PredefinedQuotesType.Motivational]: this.quotesMotivationalList,
      [PredefinedQuotesType.Business]: this.quotesBusinessList,
    };
    const selectedVariant = variants[type];

    return selectedVariant.map(
      (value) => {
        const [id, content, author] = value.split('|');
        return { id, content, author };
      },
    );
  }
}
