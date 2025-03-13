import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWaterDto } from './water/create-water.dto';
import { Water } from './water/water.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Water)
    private readonly waterRepository: Repository<Water>,
  ) {}

  async findByName(name: string): Promise<Water | null> {
    return this.waterRepository.findOne({ where: { name } });
  }

  async createWater(data: CreateWaterDto): Promise<Water> {
    const newWater = this.waterRepository.create(data);
    return this.waterRepository.save(newWater);
  }
}
