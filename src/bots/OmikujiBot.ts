import dayjs from 'dayjs';
import { Message, TextChannel } from 'discord.js';
import { BoResult } from '../entity/BoResult';
import { Omikuji } from '../entity/Omikuji';
import { connect } from '../utility';
import { BotBase } from './BotBase';

const omikuji = {
  yoshida: '吉田',
  daikichi: '大吉',
  chukichi: '中吉',
  kichi: '吉',
  syokichi: '小吉',
  suekichi: '末吉',
  kyo: '凶',
  daikyo: '大凶',
} as const;

type OmikujiKey = keyof typeof omikuji;
const borders = [1, 10, 30, 45, 60, 70, 90, 101] as const;
const omikujiKeys = Object.keys(omikuji) as OmikujiKey[];
const DATE_FORMAT = 'YYYY/MM/DD';

class OmikujiBot extends BotBase {
  protected onReady() {
    console.log('おみくじいえーい');
  }

  protected onMessage(message: Message) {
    if (message.author.bot) {
      return;
    }
    if (message.content === '!omikuji') {
      this.draw(message);
    } else if (message.content === 'おみくじ結果') {
      this.showOmikujiResult(message);
    }
  }

  private async draw(message: Message) {
    const history = await this.getResult(message);
    if (typeof history === 'undefined') {
      const fortune = getFortune();
      const insert = { userId: message.author.id, [fortune]: 1 };
      this.sendResult(message, fortune);
      connect(Omikuji, async (repository) => repository.save(insert));
      return;
    }
    if (this.isToday(history)) {
      await message.channel.send(`${this.getDisplayName(message)}くん、また明日ひいてね`);
      return;
    }
    const fortune = getFortune();
    history[fortune] += 1;
    this.sendResult(message, fortune);
    connect(Omikuji, async (repository) => repository.save(history));
  }

  private async sendResult(message: Message, fortune: OmikujiKey) {
    await message.channel.send({
      embed: {
        author: {
          name: `${this.getDisplayName(message)}くんの今日の運勢`,
        },
        color: 0x008cff,
        title: omikuji[fortune],
      },
    });
    const isBoAlreadyDraw = await connect(BoResult, async (repository) => {
      const { updatedAt } = (await repository.findOne())!;
      return dayjs(updatedAt).format(DATE_FORMAT) === dayjs().format(DATE_FORMAT);
    });
    if (isBoAlreadyDraw) {
      await message.channel.send(await this.getBotComment(message, fortune));
    }
  }

  private isToday(result: Omikuji) {
    return dayjs(result.updatedAt).format(DATE_FORMAT) === dayjs().format(DATE_FORMAT);
  }

  private async getBotComment(message: Message, fortune: OmikujiKey) {
    const { result } = (await connect(BoResult, (repo) => repo.findOne())) as BoResult;
    const mention = `<@!${message.author.id}>`;
    const victoryMessage = Math.random() < 0.5 ? 'つよい' : 'やるやん';
    const boIndex = omikujiKeys.indexOf(result);
    const userIndex = omikujiKeys.indexOf(fortune);
    if (boIndex > userIndex) {
      return `${mention} ${victoryMessage}`;
    }
    return boIndex === userIndex ? 'ふぅん' : 'ザコめ';
  }

  private async showOmikujiResult(message: Message) {
    const result = await this.getResult(message);
    const name = this.getDisplayName(message);
    if (typeof result === 'undefined') {
      await message.channel.send(`${name}くんはまだおみくじをひいたことがないみたいだよ`);
      return;
    }
    const playCount = omikujiKeys.reduce((count, prop) => count + result[prop], 0);
    const listedDecription = omikujiKeys.reduce((pre, prop) => {
      const fortune = omikuji[prop];
      const text = `${fortune.length === 1 ? '　' : ''}${fortune}: ${result[prop]}\n`;
      return pre + text;
    }, '');
    const description = `${listedDecription}合計: ${playCount}`;
    await message.channel.send({
      embed: {
        title: `${name}くんの運勢`,
        color: 0x008cff,
        description,
      },
    });
  }

  private async getResult(message: Message) {
    return connect(Omikuji, async (repository) =>
      repository.findOne({ userId: message.author.id }),
    );
  }
}

export { OmikujiBot, OmikujiKey, getFortune, sendResult };

const getFortune = () => {
  const rand = 100 * Math.random();
  const index = borders.findIndex((value) => rand < value);
  return omikujiKeys[index];
};

const sendResult = async (channel: TextChannel, fortune: OmikujiKey) => {
  await channel.send({
    embed: {
      author: {
        name: `青鬼くんの今日の運勢`,
      },
      color: 0x008cff,
      title: omikuji[fortune],
    },
  });
};
