import { config } from 'dotenv';
import { ScoreAttackBot } from './bots/ScoreAttackBot';

config();
const TEST_TOKEN = process.env.TEST_TOKEN as string;
const test = new ScoreAttackBot();
test.launch(TEST_TOKEN);
