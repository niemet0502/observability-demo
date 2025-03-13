import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coffee } from './coffe-type.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
  ) {}

  async findByName(name: string): Promise<Coffee | null> {
    return this.coffeeRepository.findOne({ where: { name } });
  }

  async createCoffee(data: CreateCoffeeDto): Promise<Coffee> {
    const newCoffee = this.coffeeRepository.create(data);
    return this.coffeeRepository.save(newCoffee);
  }
}
