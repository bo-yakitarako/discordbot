import { config } from 'dotenv';
import 'reflect-metadata';
import { OmikujiBot } from './bots/OmikujiBot';
import { SparebeatGradeCertification } from './bots/SparebeatGradeCertification';
import { GoodBot } from './bots/GoodBot';

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
