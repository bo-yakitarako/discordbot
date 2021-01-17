import { config } from 'dotenv';
import { OmikujiBot } from './bots/OmikujiBot';

config();
const TEST_TOKEN = process.env.TEST_TOKEN as string;
const test = new OmikujiBot();
test.launch(TEST_TOKEN);
