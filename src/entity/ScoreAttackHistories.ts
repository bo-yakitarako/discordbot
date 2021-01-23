/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { ScoreInfo } from '../bots/ScoreAttackBot/types';
import { ScoreAttackSongs } from './ScoreAttackSongs';

@Entity()
class ScoreAttackHistories {
  @PrimaryGeneratedColumn()
  // @ts-ignore
  historyId: number;

  @Index()
  @Column({ type: 'varchar', length: 64 })
  // @ts-ignore
  discordId: string;

  @Index()
  @Column({ type: 'varchar', length: 64 })
  // @ts-ignore
  guildId: string;

  @Column({ type: 'varchar', length: 256 })
  // @ts-ignore
  title: string;

  @Column({ type: 'varchar', length: 256 })
  // @ts-ignore
  url: string;

  @Column({ type: 'varchar', length: 128, default: '' })
  // @ts-ignore
  artist: string;

  @Column({ type: 'varchar', length: 256, nullable: true, default: null })
  // @ts-ignore
  artistWebsite: string | null;

  @Column({ type: 'varchar', length: 32 })
  // @ts-ignore
  hash: string;

  @Column({ type: 'varchar', length: 32 })
  // @ts-ignore
  mapperName: string;

  @Column({ type: 'varchar', length: 256, nullable: true, default: null })
  // @ts-ignore
  mapperDisplayName: string | null;

  @Column({ type: 'integer' })
  // @ts-ignore
  difficulty: 1 | 2 | 3;

  @Column({ type: 'integer' })
  // @ts-ignore
  level: number;

  @Column({ type: 'integer' })
  // @ts-ignore
  score: number;

  @Index()
  @Column({ type: 'varchar', length: 32 })
  // @ts-ignore
  scoreCreatedAt: string;

  @CreateDateColumn()
  // @ts-ignore
  createdAt: string;

  @UpdateDateColumn()
  // @ts-ignore
  updatedAt: string;

  public update(current: ScoreAttackSongs, scoreInfo: ScoreInfo) {
    this.title = current.title;
    this.url = current.url;
    this.artist = current.artist;
    this.artistWebsite = current.artistWebsite;
    this.hash = current.hash;
    this.mapperName = current.mapperName;
    this.mapperDisplayName = current.mapperDisplayName;
    this.difficulty = current.difficulty;
    this.level = current.level;
    this.score = scoreInfo.score;
    this.scoreCreatedAt = scoreInfo.scoreCreatedAt;
  }
}

export { ScoreAttackHistories };
