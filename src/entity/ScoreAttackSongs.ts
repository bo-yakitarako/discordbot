/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
  Entity,
  Index,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SongTable } from '../bots/ScoreAttackBot/types';

@Entity()
class ScoreAttackSongs {
  @PrimaryGeneratedColumn()
  // @ts-ignore
  songsId: number;

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

  @CreateDateColumn()
  // @ts-ignore
  createdAt: string;

  @UpdateDateColumn()
  // @ts-ignore
  updatedAt: string;

  public update(data: SongTable) {
    this.title = data.title;
    this.url = data.url;
    this.artist = data.artist;
    this.artistWebsite = data.artistWebsite;
    this.hash = data.hash;
    this.mapperName = data.mapperName;
    this.mapperDisplayName = data.mapperDisplayName;
    this.difficulty = data.difficulty;
    this.level = data.level;
  }
}

export { ScoreAttackSongs };
