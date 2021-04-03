import { Message } from 'discord.js';
import { config } from 'dotenv';
import { axios } from '.';
import { ScoreAttackUsers } from '../../entity/ScoreAttackUsers';
import { connect } from '../../utility';
import { SparebeatProfile } from './types';

config();
const SPAREBEAT_GUILD_ID = process.env.SPAREBEAT_GUILD_ID as string;
const REGISTER_CHANNEL_ID = process.env.REGISTER_CHANNEL_ID as string;

const register = async (message: Message) => {
  const guildId = message.guild?.id as string;
  const channelId = message.channel.id;
  if (guildId === SPAREBEAT_GUILD_ID && channelId !== REGISTER_CHANNEL_ID) {
    return;
  }
  const sparebeatName = message.content.split(' ')[1];
  const discordId = message.author.id;
  const mention = `<@!${discordId}>`;
  if (!sparebeatName) {
    await message.channel.send(`${mention} よくわかんないよー><`);
    return;
  }
  const sparebeatDisplayName = await getSparebeatDisplayName(sparebeatName);
  if (typeof sparebeatDisplayName === 'undefined') {
    await message.channel.send(
      `${mention} 「${sparebeatName}」というアカウントはSparebeatに登録されていないようです！`,
    );
    return;
  }
  const usersInDB = await connect(ScoreAttackUsers, async (repository) =>
    repository.findOne({ sparebeatName }),
  );
  if (typeof usersInDB !== 'undefined') {
    await message.channel.send(
      // eslint-disable-next-line max-len
      `${mention} Sparebeatアカウント「${sparebeatDisplayName}」は既に連携されてるので新しく紐付けることはできません！`,
    );
    return;
  }
  const userInDB = await connect(ScoreAttackUsers, (repository) =>
    repository.findOne({ discordId }),
  );
  if (typeof userInDB === 'undefined') {
    await connect(ScoreAttackUsers, (repository) => repository.save({ discordId, sparebeatName }));
  } else {
    userInDB.sparebeatName = sparebeatName;
    await connect(ScoreAttackUsers, (repository) => repository.save(userInDB));
  }
  await message.channel.send(
    `${mention} Sparebeatアカウント「${sparebeatDisplayName}」と連携しました！`,
  );
};

const getSparebeatDisplayName = async (sparebeatName: string) => {
  try {
    const { data } = await axios.get<SparebeatProfile>(`/api/users/${sparebeatName}`);
    return data.displayName || sparebeatName;
  } catch {
    return undefined;
  }
};

const unregister = async (message: Message) => {
  const discordId = message.author.id;
  const userInDB = await connect(ScoreAttackUsers, (repository) =>
    repository.findOne({ discordId }),
  );
  const mention = `<@!${discordId}>`;
  if (typeof userInDB === 'undefined') {
    await message.channel.send(`${mention} あんた連携してねえべさ？`);
    return;
  }
  await connect(ScoreAttackUsers, (repository) => repository.remove(userInDB));
  await message.channel.send(`${mention} Sparebeatとの連携を解除したよ`);
};

export { register, unregister, getSparebeatDisplayName };
