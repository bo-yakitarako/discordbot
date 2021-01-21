/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
class ScoreAttackUsers {
  @PrimaryGeneratedColumn()
  // @ts-ignore
  id: number;

  @Column({ type: 'varchar', length: 64 })
  // @ts-ignore
  discordId: string;

  @Column({ type: 'varchar', length: 64 })
  // @ts-ignore
  sparebeatName: string;

  @CreateDateColumn()
  // @ts-ignore
  createdAt: string;

  @UpdateDateColumn()
  // @ts-ignore
  updatedAt: string;
}
export { ScoreAttackUsers };
