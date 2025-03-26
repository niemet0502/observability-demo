import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from '@nestjs/common';
import { AppService } from './app.service';
import { trackRequest } from './metrics';
import { CreateWaterDto } from './water/create-water.dto';
import { Water } from './water/water.entity';

@Controller('water')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':name')
  async getWaterByName(@Param('name') name: string): Promise<Water> {

    trackRequest(`/water/${name}`, Math.random())
    return await this.appService.findByName(name);
  }

  @Post()
  async createWater(@Body() createWaterDto: CreateWaterDto): Promise<Water> {
    return this.appService.createWater(createWaterDto);
  }
}
