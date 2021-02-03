import { Message } from 'discord.js';
import { Raw } from 'typeorm';
import { ScoreAttackHistories } from '../../entity/ScoreAttackHistories';
import { find } from '../../utility';
import { getName } from './ranking';

const showLog = async (message: Message) => {
  const guildId = message.guild?.id as string;
  const discordId = message.author.id;
  const datas = await find(ScoreAttackHistories, {
    guildId,
    discordId,
    createdAt: Raw((alias) => `NOW() - INTERVAL '6 HOUR' < ${alias}`),
  });
  if (datas.length === 0) {
    await message.channel.send(`<@!${discordId}> 今日はなにもやってないよ`);
    return;
  }
  const fields = datas.slice(datas.length - 25).map(({ title, score, url }, index) => {
    const name = `${index + 1}. ${title}`;
    const value = `スコア: ${score}\n[リベンジ](${url})`;
    return { name, value };
  });
  const scoreMean = datas.reduce((pre, { score }) => pre + score, 0) / datas.length;
  const levelMean = datas.reduce((pre, { level }) => pre + level, 0) / datas.length;
  const description = `プレイ曲数: ${datas.length}\nスコア平均: ${scoreMean.toFixed(
    0,
  )}\nレベル平均: ${levelMean.toFixed(1)}`;
  await message.channel.send({
    embed: {
      title: `${await getName(message)}くんのプレイログ！`,
      color: 0xce9eff,
      description,
      fields,
    },
  });
};

export { showLog };
