import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'coffees' })
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  time: string;

  @Column()
  amount: string;
}
