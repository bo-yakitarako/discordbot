import { Client, Message } from 'discord.js';
import { config } from 'dotenv';
import { Pool } from 'pg';

interface SQL {
  text: string;
  values?: (number | string)[];
}

config();
const connectionString = process.env.DATABASE_URL;
abstract class Bot {
  protected abstract ready(): void;

  protected abstract message(message: Message): void;

  public launch(token: string): void {
    const client = new Client();
    client.on('ready', () => this.ready());
    client.on('message', (message) => this.message(message));
    client.login(token);
  }

  public static query<T>({ text, values = [] }: SQL): Promise<T[]> {
    return new Promise((resolve: (value: T[]) => void) => {
      const pool = new Pool({ connectionString });
      pool
        .query<T>({ text, values })
        .then(({ rows }) => {
          resolve(rows);
        })
        .catch((error: string) => console.log(error))
        .finally(() => pool.end());
    });
  }
}

export { Bot };
