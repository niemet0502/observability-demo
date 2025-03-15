import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpanStatusCode, trace } from "@opentelemetry/api";
import { Repository } from 'typeorm';
import { Coffee } from './coffe-type.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
  ) {}

  async findByName(name: string) {
    const span = trace.getTracer('coffee-db').startSpan('coffee-db');
    span.setAttribute('db.name', 'coffee-db'); 
    span.setAttribute('db.query', 'SELECT * FROM coffee'); 

    const coffe = await this.coffeeRepository.findOne({ where: { name } });

    if(!coffe){
      span.setAttribute('errorMessage', `Coffee type with name "${name}" not found`); 
      span.setStatus({ code: SpanStatusCode.ERROR, message: `Coffee type with name "${name}" not found` });
      span.end(); 
      throw new NotFoundException(`Coffee type with name "${name}" not found`); 
    }

    span.setAttribute('db.result.count', 1);
    span.setStatus({ code: SpanStatusCode.OK });
    span.end(); 
    return coffe; 
  }

  async createCoffee(data: CreateCoffeeDto): Promise<Coffee> {
    const newCoffee = this.coffeeRepository.create(data);
    return this.coffeeRepository.save(newCoffee);
  }
}
