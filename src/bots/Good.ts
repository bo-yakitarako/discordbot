import { Message } from 'discord.js';
import { Bot } from './Bot';

class Good extends Bot {
  private doingGacha: boolean;

  constructor() {
    super();
    this.doingGacha = false;
  }

  protected ready(): void {
    console.log('いいね');
  }

  protected message(message: Message): void {
    if (message.author.bot) {
      return;
    }
    if (message.content.startsWith('!rateset')) {
      try {
        const rate = parseFloat(message.content.split(' ')[1]);
        if (!Number.isNaN(rate) && rate < 1) {
          Bot.query({
            text: `UPDATE iine_rate SET rate = ${rate} WHERE id = 1;`,
          });
          message.channel.send(`いいね確率を「${rate}」にできていいね`);
        }
      } catch {
        // 何もしない
      }
    } else if (message.content.startsWith('!gacha')) {
      if (this.doingGacha) {
        return;
      }
      this.doingGacha = true;
      message.channel.send('てーてれてってー');
      this.getRate().then((rate) => {
        this.sellSoul(message, rate);
      });
    } else {
      this.getRate().then((rate) => {
        if (Math.random() < rate) {
          const emoji = message.guild && message.guild.emojis.cache.find(({ name }) => name === 'iine');
          if (emoji) {
            message.channel.send(emoji.toString());
          }
        }
      });
    }
  }

  private sellSoul(message: Message, rate: number, count = 0) {
    if (count >= 10) {
      this.doingGacha = false;
      return;
    }
    setTimeout(async () => {
      const emoji = message.guild && message.guild.emojis.cache.find(({ name }) => name === 'iine');
      if (Math.random() < rate) {
        await message.channel.send(emoji ? emoji.toString() : 'いいね');
      } else {
        await message.channel.send('よくない');
      }
      this.sellSoul(message, rate, count + 1);
    }, 500);
  }

  public async getRate(): Promise<number> {
    const res = await Bot.query<{ rate: number }>({
      text: 'SELECT rate FROM iine_rate WHERE id = 1;',
    });
    return res[0].rate;
  }
}

export { Good };
