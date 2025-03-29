import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpanStatusCode, trace } from '@opentelemetry/api';
import { Repository } from 'typeorm';
import { logger } from './logging';
import { failedRequestsGauge, successfulRequestsGauge } from './metrics';
import { CreateWaterDto } from './water/create-water.dto';
import { Water } from './water/water.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Water)
    private readonly waterRepository: Repository<Water>,
  ) {}

  async findByName(name: string) {
    logger.emit({
      severityText: "INFO",
      body: `[water-db] Executing query to find water with name: ${name}`,
    });

    // Create SQL Query Span
    const querySpan = trace.getTracer('water-db').startSpan('water-db-query');
    const query = `SELECT * FROM water WHERE name = '${name}' LIMIT 1;`;
    querySpan.setAttribute('db.query', query);
    querySpan.setAttribute('db.name', 'water-db');
    querySpan.end(); // End query span

    try {
        const result = await this.waterRepository.findOne({ where: { name } });

        if (!result) {
            const errorSpan = trace.getTracer('water-db').startSpan('water-db-error');
            const errorMessage = `Water with name "${name}" not found`;

            logger.emit({
              severityText: "ERROR",
              body: `[water-db] ${errorMessage}`,
            });

            errorSpan.setAttribute('db.name', 'water-db');
            errorSpan.setAttribute('db.result.count', 0);
            errorSpan.setAttribute('errorMessage', errorMessage);
            errorSpan.setStatus({ code: SpanStatusCode.ERROR, message: errorMessage });
            errorSpan.end(); // End error span

            // ✅ Increment failed request count (using Gauge)
            failedRequestsGauge.add(1, {
              traceId: errorSpan.spanContext().traceId,
              spanId: errorSpan.spanContext().spanId,
          });  // Add 1 to failed requests gauge

            throw new NotFoundException(errorMessage);
        }

        logger.emit({
          severityText: "INFO",
          body: `[water-db] Successfully found water: ${JSON.stringify(result)}`,
        });

        // Capture Successful Result Span
        const resultSpan = trace.getTracer('water-db').startSpan('water-db-result');
        resultSpan.setAttribute('db.result.count', 1);
        resultSpan.setStatus({ code: SpanStatusCode.OK });
        // ✅ Increment successful request count (using Gauge)
        successfulRequestsGauge.add(1, {
          traceId: resultSpan.spanContext().traceId,
          spanId: resultSpan.spanContext().spanId,
        }); 
        resultSpan.end(); // End result span

        console.log(resultSpan.spanContext().traceId);
        
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
