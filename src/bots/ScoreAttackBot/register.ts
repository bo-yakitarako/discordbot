import { Guild, GuildMember, Message } from 'discord.js';
import { axios } from '.';
import { ScoreAttackUsers } from '../../entity/ScoreAttackUsers';
import { connect } from '../../utility';
import { SparebeatProfile } from './types';

const register = async (message: Message) => {
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
  const registeredName = await getDiscordDisplayNameFromSparebeatName(message, sparebeatName);
  if (typeof registeredName !== 'undefined') {
    await message.channel.send(
      // eslint-disable-next-line max-len
      `${mention} Sparebeatアカウント「${sparebeatDisplayName}」は既にこの鯖にいる${registeredName}さんと連携されてるので新しく紐付けることはできません！`,
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

const getDiscordDisplayNameFromSparebeatName = async (message: Message, sparebeatName: string) => {
  const usersInDB = await connect(ScoreAttackUsers, async (repository) =>
    repository.find({ sparebeatName }),
  );
  if (typeof usersInDB === 'undefined') {
    return undefined;
  }
  const guild = message.guild as Guild;
  const userInDB = usersInDB.find(
    ({ discordId }) =>
      typeof guild.members.cache.find(({ id }) => id === discordId && id !== message.author.id) !==
      'undefined',
  );
  if (typeof userInDB === 'undefined') {
    return undefined;
  }
  const member = guild.members.cache.find(({ id }) => id === userInDB.discordId) as GuildMember;
  return member.displayName;
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
