import { config } from 'dotenv';
import { Omikuji } from './bots/Omikuji';
import { SparebeatGradeCertification } from './bots/SparebeatGradeCertification';
import { GoodBot } from './bots/GoodBot';
import 'reflect-metadata';

config();
const TOKEN = process.env.OMIKUJI_TOKEN as string;
const omikuji = new Omikuji();
omikuji.launch(TOKEN);

const SGC_TOKEN = process.env.SGC_TOKEN as string;
const sgc = new SparebeatGradeCertification();
sgc.launch(SGC_TOKEN);

const GOOD_TOKEN = process.env.GOOD_TOKEN as string;
const good = new GoodBot();
good.launch(GOOD_TOKEN);
