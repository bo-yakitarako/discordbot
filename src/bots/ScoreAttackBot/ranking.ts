import { Guild, Message } from 'discord.js';
import { ScoreAttackHistories } from '../../entity/ScoreAttackHistories';
import { connect } from '../../utility';

const showRanking = async (message: Message, beforeHour = 6) => {
  await message.channel.send('うんこー');
  const discordIds = await connect(ScoreAttackHistories, async (repository) => {
    const guildId = (message.guild as Guild).id;
    const discordIdsInDB = await repository
      .createQueryBuilder()
      .select('"discordId"')
      .distinct(true)
      .where(`"guildId" = '${guildId}'`)
      .andWhere(`NOW() - INTERVAL '${beforeHour} HOUR' < "createdAt"`)
      .getRawMany<{ discordId: string }>();
    console.log(discordIdsInDB);
    return discordIdsInDB.map(({ discordId }) => discordId);
  });
  console.log(discordIds);
};

export { showRanking };
