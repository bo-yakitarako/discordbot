import { Guild, GuildMember, Message } from 'discord.js';
import { axios } from '.';
import { ScoreAttackUsers } from '../../entity/ScoreAttackUsers';
import { connect } from '../../utility';
import { SparebeatProfile } from './types';

const register = async (message: Message) => {
  const sparebeatName = message.content.split(' ')[1];
  const discordId = message.author.id;
  const reply = `<@!${discordId}>`;
  if (!sparebeatName) {
    await message.channel.send(`${reply} よくわかんないよー><`);
    return;
  }
  const sparebeatDisplayName = await getSparebeatDisplayName(sparebeatName);
  if (typeof sparebeatDisplayName === 'undefined') {
    await message.channel.send(
      `${reply} 「${sparebeatName}」というユーザーはSparebeatに登録されていないようです！`,
    );
    return;
  }
  const registeredName = await getDiscordDisplayNameFromSparebeatName(message, sparebeatName);
  if (typeof registeredName !== 'undefined') {
    await message.channel.send(
      `${reply} Sparebeatユーザー「${sparebeatDisplayName}」は
        既にこの鯖にいる${registeredName}さんと連携されてるので新しく紐付けることはできません！`,
    );
    return;
  }
  await connect(ScoreAttackUsers, async (repository) =>
    repository.save({ discordId, sparebeatName }),
  );
  await message.channel.send(
    `${reply} Sparebeatアカウント「${sparebeatDisplayName}」と連携しました！`,
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
    ({ discordId }) => guild.members.cache.find(({ id }) => id === discordId) !== undefined,
  );
  if (typeof userInDB === 'undefined') {
    return undefined;
  }
  const member = guild.members.cache.find(({ id }) => id === userInDB.discordId) as GuildMember;
  return member.displayName;
};

export { register, getSparebeatDisplayName };
