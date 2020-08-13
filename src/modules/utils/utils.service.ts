import { Injectable } from '@nestjs/common';
import namesListText from '../../assets/names-days.txt';
import holidaysListText from '../../assets/holidays.txt';

@Injectable()
export class UtilsService {
  constructor() {}
  private namesList = namesListText.split('\r\n');
  private holidaysList = holidaysListText.split('\r\n');

  getDayNames(index: number): string {
    return this.namesList[index];
  }

  getHoliday(index: number): string {
    return this.holidaysList[index];
  }
}
