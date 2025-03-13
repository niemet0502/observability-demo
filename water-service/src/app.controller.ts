import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateWaterDto } from './water/create-water.dto';
import { Water } from './water/water.entity';

@Controller('water')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':name')
  async getWaterByName(@Param('name') name: string): Promise<Water> {
    const water = await this.appService.findByName(name);
    if (!water) {
      throw new NotFoundException(`Water with name "${name}" not found`);
    }
    return water;
  }

  @Post()
  async createWater(@Body() createWaterDto: CreateWaterDto): Promise<Water> {
    return this.appService.createWater(createWaterDto);
  }
}
