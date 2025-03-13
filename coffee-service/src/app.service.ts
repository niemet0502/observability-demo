import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  private async fetchCoffee(name: string) {
    try {
      const response = await this.httpService.axiosRef.get(
        `http://localhost:3011/coffee-type/${name}`,
      );
      return response.data;
    } catch (error) {
      throw new NotFoundException(`Coffee with name "${name}" not found`);
    }
  }

  private async fetchWater(name: string) {
    try {
      const response = await this.httpService.axiosRef.get(
        `http://localhost:3010/water/${name}`,
      );
      return response.data;
    } catch (error) {
      throw new NotFoundException(`Water with name "${name}" not found`);
    }
  }

  async getBeverageDetails(coffeeName: string, waterName: string) {
    const [coffee, water] = await Promise.all([
      this.fetchCoffee(coffeeName),
      this.fetchWater(waterName),
    ]);

    return {
      coffee,
      water,
    };
  }
}
