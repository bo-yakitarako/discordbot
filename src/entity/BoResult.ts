/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OmikujiKey } from '../bots/OmikujiBot';

@Entity()
class BoResult {
  @PrimaryGeneratedColumn()
  // @ts-ignore
  id: number;

  @Column({ type: 'varchar', default: 'kichi', length: 32 })
  // @ts-ignore
  result: OmikujiKey;

  @CreateDateColumn()
  // @ts-ignore
  createdAt: string;

  @UpdateDateColumn()
  // @ts-ignore
  updatedAt: string;
}
export { BoResult };
