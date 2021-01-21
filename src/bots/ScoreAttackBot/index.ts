import { Message } from 'discord.js';
import axiosBase from 'axios';
import { BotBase } from '../BotBase';
import { register } from './register';

class ScoreAttackBot extends BotBase {
  protected onReady() {
    console.log('すこあた起動マン');
  }

  protected onMessage(message: Message) {
    if (message.author.bot) {
      return;
    }
    if (message.content.startsWith('!register')) {
      register(message);
    }
  }
}

export { ScoreAttackBot, axios };

const axios = axiosBase.create({
  baseURL: 'https://beta.sparebeat.com',
  headers: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-Type': 'application/json',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'X-Requested-With': 'XMLHttpRequest',
  },
  responseType: 'json',
});
