/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
class ScoreAttackGroups {
  @PrimaryGeneratedColumn()
  // @ts-ignore
  groupId: number;

  @Column({ type: 'varchar', length: 256 })
  // @ts-ignore
  groupName: string;

  @CreateDateColumn()
  // @ts-ignore
  createdAt: string;

  @UpdateDateColumn()
  // @ts-ignore
  updatedAt: string;
}
export { ScoreAttackGroups };
