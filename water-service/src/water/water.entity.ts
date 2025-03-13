import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'waters' })
export class Water {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  temparature: string;

  @Column()
  amount: string;
}
