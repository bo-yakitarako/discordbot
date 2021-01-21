/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
class Omikuji {
  @PrimaryGeneratedColumn()
  // @ts-ignore
  id: number;

  @Column({ type: 'varchar', length: 64 })
  // @ts-ignore
  userId: string;

  @Column({ type: 'integer', default: 0 })
  // @ts-ignore
  yoshida: number;

  @Column({ type: 'integer', default: 0 })
  // @ts-ignore
  daikichi: number;

  @Column({ type: 'integer', default: 0 })
  // @ts-ignore
  chukichi: number;

  @Column({ type: 'integer', default: 0 })
  // @ts-ignore
  kichi: number;

  @Column({ type: 'integer', default: 0 })
  // @ts-ignore
  syokichi: number;

  @Column({ type: 'integer', default: 0 })
  // @ts-ignore
  suekichi: number;

  @Column({ type: 'integer', default: 0 })
  // @ts-ignore
  kyo: number;

  @Column({ type: 'integer', default: 0 })
  // @ts-ignore
  daikyo: number;

  @CreateDateColumn()
  // @ts-ignore
  createdAt: string;

  @UpdateDateColumn()
  // @ts-ignore
  updatedAt: string;
}

export { Omikuji };
