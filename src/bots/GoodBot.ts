import { Message } from 'discord.js';
import { GoodRate } from '../entity/GoodRate';
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
    this.message = message;
    if (message.content.startsWith('!setrate')) {
      this.setRate();
    } else if (message.content === '!showrate') {
      this.showRate();
    } else if (message.content === '!gacha' && !this.doingGacha) {
      this.sellSoul();
    } else {
      this.sendGood();
    }
  }

  private async sendGood() {
    const rate = await this.getRate();
    if (Math.random() < rate) {
      const emoji = this.getEmoji();
      if (emoji) {
        this.message.channel.send(emoji.toString());
      }
    }
  }

  private async showRate() {
    const rate = await this.getRate();
    const fixedRate = (rate * 100).toFixed(1);
    this.message.channel.send(`今の確率は「${fixedRate}%」だよ`);
  }

  private async getRate() {
    return this.connect(GoodRate, async (repository) => {
      const { rate } = (await repository.findOne({ id: 1 })) as GoodRate;
      return rate;
    });
  }

  private async setRate() {
    this.connect(GoodRate, async (repository) => {
      try {
        const rate = parseFloat(this.message.content.split(' ')[1]);
        if (Number.isNaN(rate)) {
          this.message.channel.send('数字じゃないとわかんないね');
          return;
        }
        if (rate < 0 || rate > 100) {
          this.message.channel.send('0から100までの数字にしてほしいなー');
          return;
        }
        const goodRate = (await repository.findOne({ id: 1 })) as GoodRate;
        goodRate.rate = rate / 100;
        await repository.save(goodRate);
        this.message.channel.send(`いいね確率を「${rate}%」にできていいね`);
      } catch {
        this.message.channel.send('確率指定してなくない？');
      }
    });
  }

  private async sellSoul(rate?: number, count = 0) {
    if (count >= 10) {
      this.doingGacha = false;
      return;
    }
    if (typeof rate === 'undefined') {
      this.message.channel.send('てーてれってってー');
      // eslint-disable-next-line no-param-reassign
      rate = await this.getRate();
      this.doingGacha = true;
    }
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));
    const emoji = this.getEmoji();
    if (Math.random() < rate) {
      await this.message.channel.send(emoji ? emoji.toString() : 'いいね');
    } else {
      await this.message.channel.send('よくない');
    }
    this.sellSoul(rate, count + 1);
  }

  private getEmoji() {
    if (!this.message.guild) {
      return undefined;
    }
    return this.message.guild.emojis.cache.find(({ name }) => name === 'iine');
  }
}

export { GoodBot };
