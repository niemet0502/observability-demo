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
    const querySpan = trace.getTracer('coffee-db').startSpan('coffee-db-query');
    const query = `SELECT * FROM coffee WHERE name = '${name}' LIMIT 1;`;
    querySpan.setAttribute('db.query', query);
    querySpan.setAttribute('db.name', 'coffee-db');
    querySpan.end(); // End query span

    try {
        const coffee = await this.coffeeRepository.findOne({ where: { name } });

        if (!coffee) {
            // Capture Error Case
            const errorSpan = trace.getTracer('coffee-db').startSpan('coffee-db-error');
            const errorMessage = `Coffee type with name "${name}" not found`;
            errorSpan.setAttribute('errorMessage', errorMessage);
            errorSpan.setAttribute('db.name', 'coffee-db');
            errorSpan.setAttribute('db.result.count', 0);
            errorSpan.setStatus({ code: SpanStatusCode.ERROR, message: errorMessage });
            errorSpan.end(); // End error span

            throw new NotFoundException(errorMessage);
        }

        // Capture Successful Result
        const resultSpan = trace.getTracer('coffee-db').startSpan('coffee-db-result');
        resultSpan.setAttribute('db.result.count', 1);
        resultSpan.setStatus({ code: SpanStatusCode.OK });
        resultSpan.end(); // End result span

        return coffee;
    } catch (error) {
        throw error; // Ensure error is properly thrown and handled by the caller
    }
}



  async createCoffee(data: CreateCoffeeDto): Promise<Coffee> {
    const newCoffee = this.coffeeRepository.create(data);
    return this.coffeeRepository.save(newCoffee);
  }
}
