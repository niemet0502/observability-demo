import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpanStatusCode, trace } from '@opentelemetry/api';
import { Repository } from 'typeorm';
import { errorRequestCounter, successRequestCounter } from './metrics';
import { CreateWaterDto } from './water/create-water.dto';
import { Water } from './water/water.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Water)
    private readonly waterRepository: Repository<Water>,
  ) {}

  async findByName(name: string) {
    const querySpan = trace.getTracer('water-db').startSpan('water-db-query');
    const query = `SELECT * FROM water WHERE name = '${name}' LIMIT 1;`;
    querySpan.setAttribute('db.query', query);
    querySpan.setAttribute('db.name', 'water-db');
    querySpan.end(); 

    try {
        const result = await this.waterRepository.findOne({ where: { name } });

        if (!result) {
            const errorSpan = trace.getTracer('water-db').startSpan('water-db-error');
            const errorMessage = `Water with name "${name}" not found`;
            errorSpan.setAttribute('db.name', 'water-db');
            errorSpan.setAttribute('db.result.count', 0);
            errorSpan.setAttribute('errorMessage', errorMessage);
            errorSpan.setStatus({ code: SpanStatusCode.ERROR, message: errorMessage });
            errorSpan.end();

            errorRequestCounter.record(1);
            throw new NotFoundException(errorMessage);
        }

        // Capture Successful Result
        const resultSpan = trace.getTracer('water-db').startSpan('water-db-result');
        resultSpan.setAttribute('db.result.count', 1);
        resultSpan.setStatus({ code: SpanStatusCode.OK });
        resultSpan.end(); // End result span

        successRequestCounter.record(1);
        return result;
    } catch (error) {
        throw error; // Ensure error is properly thrown and handled
     }
  }


  async createWater(data: CreateWaterDto): Promise<Water> {
    const newWater = this.waterRepository.create(data);
    return this.waterRepository.save(newWater);
  }
}
