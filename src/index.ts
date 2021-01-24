import { config } from 'dotenv';
import 'reflect-metadata';
import { OmikujiBot } from './bots/OmikujiBot';
import { SparebeatGradeCertification } from './bots/SparebeatGradeCertification';
import { GoodBot } from './bots/GoodBot';
import { ScoreAttackBot } from './bots/ScoreAttackBot';

config();
const OMIKUJI_TOKEN = process.env.OMIKUJI_TOKEN as string;
const omikuji = new OmikujiBot();
omikuji.launch(OMIKUJI_TOKEN);

const SGC_TOKEN = process.env.SGC_TOKEN as string;
const sgc = new SparebeatGradeCertification();
sgc.launch(SGC_TOKEN);

const GOOD_TOKEN = process.env.GOOD_TOKEN as string;
const good = new GoodBot();
good.launch(GOOD_TOKEN);

const SCORE_ATTACK_TOKEN = process.env.SCORE_ATTACK_TOKEN as string;
const scoreAttack = new ScoreAttackBot();
scoreAttack.launch(SCORE_ATTACK_TOKEN);
