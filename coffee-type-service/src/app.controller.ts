import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Coffee } from './coffe-type.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';

@Controller('coffee-type')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':name')
  async getCoffeeByName(@Param('name') name: string): Promise<Coffee> {
    const coffee = await this.appService.findByName(name);
    if (!coffee) {
      throw new NotFoundException(`Coffee type with name "${name}" not found`);
    }
    return coffee;
  }

  @Post()
  async createCoffee(
    @Body() createCoffeeDto: CreateCoffeeDto,
  ): Promise<Coffee> {
    return this.appService.createCoffee(createCoffeeDto);
  }
}
