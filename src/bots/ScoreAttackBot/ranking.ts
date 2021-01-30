import { Guild, Message } from 'discord.js';
import { ScoreAttackHistories } from '../../entity/ScoreAttackHistories';
import { connect } from '../../utility';

const showRanking = async (message: Message) => {
  const beforeHour = findBeforeHour(message);
  const queryResult = await query(message, beforeHour);
  const rankingElements = await Promise.all(
    queryResult.map(async ({ score, discordId }) => ({
      score,
      memberName: await getName(message, discordId),
    })),
  );
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

const query = async (message: Message, beforeHour: number) =>
  connect(ScoreAttackHistories, (repository) =>
    repository
      .createQueryBuilder('histories')
      .select('"discordId", SUM("score") as score')
      .where(`"guildId" = '${(message.guild as Guild).id}'`)
      .andWhere(`NOW() - INTERVAL '${beforeHour} HOUR' < "createdAt"`)
      .groupBy('"discordId"')
      .orderBy('score', 'DESC')
      .getRawMany<{ discordId: string; score: string }>(),
  );

const getName = async (message: Message, id?: string) => {
  const discordId = id || message.author.id;
  const member = (message.guild as Guild).members.cache.find(({ id }) => id === discordId);
  if (typeof member !== 'undefined') {
    return member.displayName;
  }
  try {
    const user = await message.client.users.fetch(discordId);
    return user.username;
  } catch {
    return '今は亡き戦友[ライバル]';
  }
};

export { showRanking, getName };
