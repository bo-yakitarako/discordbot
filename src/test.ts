import { config } from 'dotenv';
import { GoodBot } from './bots/GoodBot';

config();
const TEST_TOKEN = process.env.TEST_TOKEN as string;
const test = new GoodBot();
test.launch(TEST_TOKEN);
