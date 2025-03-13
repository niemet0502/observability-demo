import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCoffeeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  time: string;

  @IsNotEmpty()
  @IsString()
  amount: string;
}
