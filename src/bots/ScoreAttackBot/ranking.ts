import { Guild, Message } from 'discord.js';
import { Raw } from 'typeorm';
import { ScoreAttackHistories } from '../../entity/ScoreAttackHistories';
import { connect, find } from '../../utility';
import { RankingElement } from './types';

const showRanking = async (message: Message) => {
  const beforeHour = findBeforeHour(message);
  const discordIds = await connect(ScoreAttackHistories, async (repository) => {
    const discordIdsInDB = await repository
      .createQueryBuilder()
      .select('"discordId"')
      .distinct(true)
      .where(`"guildId" = '${(message.guild as Guild).id}'`)
      .andWhere(`NOW() - INTERVAL '${beforeHour} HOUR' < "createdAt"`)
      .getRawMany<{ discordId: string }>();
    return discordIdsInDB.map(({ discordId }) => discordId);
  });
  const rankingElements = await parseRankingElements(message, discordIds, beforeHour);
  const fields = rankingElements.map(({ score, memberName }, index) => ({
    name: `${index + 1}位: ${memberName}`,
    value: `合計: ${score}`,
  }));
  await message.channel.send({
    embed: {
      title: '結果はっぴょぉ〜〜〜〜',
      color: 0xce9eff,
      fields,
    },
  });
};

const findBeforeHour = (message: Message) => {
  const hour = parseInt(message.content.split(' ')[1], 10);
  return Number.isNaN(hour) ? 6 : hour;
};

const parseRankingElements = async (message: Message, discordIds: string[], beforeHour: number) => {
  const members = (message.guild as Guild).members.cache;
  const scores = [] as RankingElement[];
  // eslint-disable-next-line no-restricted-syntax
  for (const discordId of discordIds) {
    // eslint-disable-next-line no-await-in-loop
    const score = await calcUserScoreSum(discordId, beforeHour);
    const memberName =
      members.find(({ id }) => id === discordId)?.displayName || '今は亡き戦友[ライバル]';
    scores.push({ score, memberName });
  }
  return scores.sort((a, b) => b.score - a.score);
};

const calcUserScoreSum = async (discordId: string, beforeHour: number) => {
  const histories = await find(ScoreAttackHistories, {
    discordId,
    createdAt: Raw((alias) => `NOW() - INTERVAL '${beforeHour} HOUR' < ${alias}`),
  });
  return histories.reduce((pre, { score }) => pre + score, 0);
};

export { showRanking };
