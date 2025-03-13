import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Coffee } from './coffe-type.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'admin',
      password: 'passer',
      database: 'coffee',
      entities: [Coffee],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Coffee]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
