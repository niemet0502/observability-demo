import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpanStatusCode, trace } from '@opentelemetry/api';
import { Repository } from 'typeorm';
import { CreateWaterDto } from './water/create-water.dto';
import { Water } from './water/water.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Water)
    private readonly waterRepository: Repository<Water>,
  ) {}

  async findByName(name: string) {
    const span = trace.getTracer('water-db').startSpan('water-db')
    span.setAttribute('db.name', 'water-db'); 
    span.setAttribute('db.query', 'SELECT * FROM water'); 
    const result = await  this.waterRepository.findOne({ where: { name } });

    if(!result){
      span.setAttribute('errorMessage', `Water with name "${name}" not found`); 
      span.setStatus({ code: SpanStatusCode.ERROR, message: `Water with name "${name}" not found` });
      span.end(); 
      throw new NotFoundException(`Water with name "${name}" not found`); 
    }

    span.setAttribute('db.result.count', 1);
    span.setStatus({ code: SpanStatusCode.OK });
    span.end(); 
    return result; 
  }

  async createWater(data: CreateWaterDto): Promise<Water> {
    const newWater = this.waterRepository.create(data);
    return this.waterRepository.save(newWater);
  }
}
