/* eslint-disable @typescript-eslint/ban-ts-comment */

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
class GoodRate {
  @PrimaryGeneratedColumn()
  // @ts-ignore
  id?: number;

  @Column({ type: 'double precision', default: 0 })
  // @ts-ignore
  rate: number;

  @CreateDateColumn()
  // @ts-ignore
  createdAt?: string;

  @UpdateDateColumn()
  // @ts-ignore
  updatedAt?: string;

  constructor(options: GoodRate) {
    Object.assign(this, options);
  }
}

export { GoodRate };
