import { config } from 'dotenv';
import { SparebeatGradeCertification } from './bots/SparebeatGradeCertification';

config();
const TEST_TOKEN = process.env.TEST_TOKEN as string;
const test = new SparebeatGradeCertification();
test.launch(TEST_TOKEN);
