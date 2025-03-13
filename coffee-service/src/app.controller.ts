import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':coffeeName/:waterName')
  async getBeverage(
    @Param('coffeeName') coffeeName: string,
    @Param('waterName') waterName: string,
  ) {
    return this.appService.getBeverageDetails(coffeeName, waterName);
  }
}
