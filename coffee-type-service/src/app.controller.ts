import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from '@nestjs/common';
import { AppService } from './app.service';
import { Coffee } from './coffe-type.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';

@Controller('coffee-type')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':name')
  async getCoffeeByName(@Param('name') name: string){
    return  await this.appService.findByName(name);
  }

  @Post()
  async createCoffee(
    @Body() createCoffeeDto: CreateCoffeeDto,
  ): Promise<Coffee> {
    return this.appService.createCoffee(createCoffeeDto);
  }
}
