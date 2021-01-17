import { Message } from 'discord.js';
import { GoodRate } from '../entity/GoodRate';
import { connect } from '../utility';
import { BotBase } from './BotBase';

class GoodBot extends BotBase {
  private doingGacha: boolean;

  constructor() {
    super();
    this.doingGacha = false;
  }

  protected onReady() {
    console.log('いいねいいね');
  }

  protected onMessage(message: Message) {
    if (message.author.bot) {
      return;
    }
    if (message.content.startsWith('!setrate')) {
      this.setRate(message);
    } else if (message.content === '!showrate') {
      this.showRate(message);
    } else if (message.content === '!gacha' && !this.doingGacha) {
      this.sellSoul(message);
    } else {
      this.sendGood(message);
    }
  }

  private async sendGood(message: Message) {
    const rate = await this.getRate();
    if (Math.random() < rate) {
      const emoji = this.getEmoji(message);
      if (emoji) {
        message.channel.send(emoji.toString());
      }
    }
  }

  private async showRate(message: Message) {
    const rate = await this.getRate();
    const fixedRate = (rate * 100).toFixed(1);
    message.channel.send(`今の確率は「${fixedRate}%」だよ`);
  }

  private async getRate() {
    return connect(GoodRate, async (repository) => {
      const { rate } = (await repository.findOne({ id: 1 })) as GoodRate;
      return rate;
    });
  }

  private async setRate(message: Message) {
    connect(GoodRate, async (repository) => {
      try {
        const rate = parseFloat(message.content.split(' ')[1]);
        if (Number.isNaN(rate)) {
          message.channel.send('数字じゃないとわかんないね');
          return;
        }
        if (rate < 0 || rate > 100) {
          message.channel.send('0から100までの数字にしてほしいなー');
          return;
        }
        const goodRate = (await repository.findOne({ id: 1 })) as GoodRate;
        goodRate.rate = rate / 100;
        await repository.save(goodRate);
        message.channel.send(`いいね確率を「${rate}%」にできていいね`);
      } catch {
        message.channel.send('確率指定してなくない？');
      }
    });
  }

  private async sellSoul(message: Message, rate?: number, count = 0) {
    if (count >= 10) {
      this.doingGacha = false;
      return;
    }
    if (typeof rate === 'undefined') {
      message.channel.send('てーてれってってー');
      // eslint-disable-next-line no-param-reassign
      rate = await this.getRate();
      this.doingGacha = true;
    }
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
    const emoji = this.getEmoji(message);
    if (Math.random() < rate) {
      await message.channel.send(emoji ? emoji.toString() : 'いいね');
    } else {
      await message.channel.send('よくない');
    }
    this.sellSoul(message, rate, count + 1);
  }

  private getEmoji(message: Message) {
    if (!message.guild) {
      return undefined;
    }
    return message.guild.emojis.cache.find(({ name }) => name === 'iine');
  }
}

export { GoodBot };
