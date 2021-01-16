import { Message, User, Guild, GuildMember } from 'discord.js';
import { convertToTimeZone } from 'date-fns-timezone';
import { Bot } from './Bot';

const OMIKUJI = {
  yoshida: '吉田',
  daikichi: '大吉',
  chukichi: '中吉',
  kichi: '吉',
  syokichi: '小吉',
  suekichi: '末吉',
  kyo: '凶',
  daikyo: '大凶',
} as const;

type OmikujiKey = keyof typeof OMIKUJI;
type OmikujiData = { [key in OmikujiKey]: number };
const OMIKUJI_KEYS = Object.keys(OMIKUJI) as OmikujiKey[];

class Omikuji extends Bot {
  protected ready(): void {
    console.log('ガンダ無');
  }

  protected message(message: Message): void {
    const mention = (author: User) => `<@!${author.id}>`;
    const TINTINS = [
      'ちんこ',
      'チンチン',
      'ﾁﾝﾁﾝ',
      'ちんぽ',
      '肉棒',
      '肉の棒',
      'マラ',
      '太いの',
      'ふといの',
      'いちもつ',
      'イチモツ',
      '一物',
      'キノコ',
      'きのこ',
      'てぃんてぃん',
      'ナニ',
      'ぺにす',
      'ペニス',
      'チンポ',
      'まんこ',
      'チンコ',
      'チンチン',
      'ちーん',
      'チーン',
      '金玉',
      'きんたま',
      'キンタマ',
      '竿',
      '息子',
      'ムスコ',
      'ソーセージ',
    ];
    if (message.author.bot) {
      return;
    }
    if (message.content === '!omikuji') {
      Omikuji.getLastDate(message).then((result: string) => {
        if (result === Omikuji.today()) {
          const name = ((message.guild as Guild).member(message.author) as GuildMember).displayName;
          message.channel.send(`${name}くん、また明日引いてね`);
        } else if (!result) {
          Omikuji.addOmikujiMember(message).finally(() => {
            Omikuji.drawFortune(message);
          });
        } else {
          Omikuji.drawFortune(message);
        }
      });
    } else if (message.content === 'おみくじ結果') {
      Omikuji.showOmikujiResult(message);
    } else if (message.content.includes('ちんちん')) {
      message.channel.send(`${mention(message.author)} ちんちん`);
    } else if (message.content.includes('うんち')) {
      message.channel.send(`${mention(message.author)} ぶり`);
    } else if (TINTINS.some((timpo) => message.content.includes(timpo))) {
      message.channel.send(`${mention(message.author)} ちんちんっていえ！！！`);
    }
  }

  private static drawFortune(message: Message): void {
    const fortune = Omikuji.getFortune();
    const today = Omikuji.today();
    const queryText = `UPDATE omikuji SET ${fortune} = ${fortune} + 1, last_date = '${today}' WHERE user_id = $1`;
    Bot.query({ text: queryText, values: [message.author.id] })
      .then(() => {
        const name = ((message.guild as Guild).member(message.author) as GuildMember).displayName;
        message.channel.send({
          embed: {
            author: {
              name: `${name}くんの今日の運勢`,
            },
            color: 0x008cff,
            title: OMIKUJI[fortune],
          },
        });
      })
      .finally(() => {
        Bot.query<{ result: OmikujiKey; date: string }>({
          text: 'SELECT result, date FROM bo_result',
        }).then((value) => {
          const { result, date } = value[0];
          if (date !== today) {
            if (message.author.id === '718705193373532160') {
              Bot.query({
                text: `UPDATE bo_result SET result = '${fortune}', date = '${today}' WHERE id = 1`,
              });
            }
            return;
          }
          message.channel.send(Omikuji.getBotComment(message, result, fortune));
        });
      });
  }

  private static getFortune(): OmikujiKey {
    const rand = 100 * Math.random();
    if (rand < 1) {
      return 'yoshida';
    }
    if (rand < 10) {
      return 'daikichi';
    }
    if (rand < 30) {
      return 'chukichi';
    }
    if (rand < 45) {
      return 'kichi';
    }
    if (rand < 60) {
      return 'syokichi';
    }
    if (rand < 70) {
      return 'suekichi';
    }
    if (rand < 90) {
      return 'kyo';
    }
    return 'daikyo';
  }

  private static getBotComment(message: Message, result: OmikujiKey, fortune: OmikujiKey) {
    const mention = `<@!${message.author.id}>`;
    const victoryMessage = Math.random() < 0.5 ? 'つよい' : 'やるやん';
    const omikujiKeys = Object.keys(OMIKUJI) as OmikujiKey[];
    const boIndex = omikujiKeys.indexOf(result);
    const userIndex = omikujiKeys.indexOf(fortune);
    if (boIndex > userIndex) {
      return `${mention} ${victoryMessage}`;
    }
    return boIndex === userIndex ? 'ふぅん' : 'ザコめ';
  }

  private static async getLastDate(message: Message): Promise<string> {
    const queryText = 'SELECT last_date FROM omikuji WHERE user_id = $1;';
    const res = await Bot.query<{ last_date: string }>({
      text: queryText,
      values: [message.author.id],
    });
    return res.length > 0 ? res[0].last_date : '';
  }

  private static async addOmikujiMember(message: Message): Promise<void> {
    const queryText = 'INSERT INTO omikuji(user_id, last_date) VALUES($1, $2);';
    await Bot.query({
      text: queryText,
      values: [message.author.id, Omikuji.today()],
    });
  }

  private static today(): string {
    const utcTime = new Date();
    const japanTime = convertToTimeZone(utcTime, {
      timeZone: 'Asia/Tokyo',
    });
    return `${japanTime.getFullYear()}-${japanTime.getMonth() + 1}-${japanTime.getDate()}`;
  }

  private static showOmikujiResult(message: Message): void {
    const queryText = `SELECT ${OMIKUJI_KEYS.join(', ')} FROM omikuji WHERE user_id = $1;`;
    Bot.query<OmikujiData>({
      text: queryText,
      values: [message.author.id],
    }).then((result) => {
      const name = ((message.guild as Guild).member(message.author) as GuildMember).displayName;
      if (result.length === 0) {
        message.channel.send(`${name}くんはまだおみくじをひいたことがないみたいだよ`);
      } else {
        const invalidKeys = ['id', 'user_id', 'last_date'];
        const [listStrings, playCount] = (Object.keys(result[0]) as OmikujiKey[]).reduce(
          (pre, prop) => {
            const [list, count] = pre;
            const value = result[0][prop];
            if (!value || invalidKeys.includes(prop)) {
              return [[...list], count];
            }
            const fortune = OMIKUJI[prop];
            return [[...list, `${(fortune.length === 1 ? '　' : '') + fortune}: ${value}`], count + value];
          },
          [[], 0] as [string[], number],
        );
        message.channel.send({
          embed: {
            title: `${name}くんの今までの運勢`,
            color: 0x008cff,
            description: `${listStrings.join('\n')}\n合計: ${playCount}`,
          },
        });
      }
    });
  }
}

export { Omikuji };
