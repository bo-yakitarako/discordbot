import { config } from 'dotenv';

config();

const isDevelopment = () => {
  return process.env.debug === 'true';
};

export { isDevelopment };
