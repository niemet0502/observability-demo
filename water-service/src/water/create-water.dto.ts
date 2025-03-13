import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWaterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  temparature: string;

  @IsNotEmpty()
  @IsString()
  amount: string;
}
