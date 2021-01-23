import dayjs from 'dayjs';
import { Guild, GuildMember, Message } from 'discord.js';
import { axios } from '.';
import { ScoreAttackHistories } from '../../entity/ScoreAttackHistories';
import { ScoreAttackSongs } from '../../entity/ScoreAttackSongs';
import { ScoreAttackUsers } from '../../entity/ScoreAttackUsers';
import { connect } from '../../utility';
import { getDescription } from './songSelect';
import { PlayRecord, ScoreInfo } from './types';

const scoring = async (message: Message) => {
  const guildId = (message.guild as Guild).id;
  const current = await connect(ScoreAttackSongs, (repository) => repository.findOne({ guildId }));
  if (typeof current === 'undefined') {
    await message.channel.send(`曲が設定されてないよー`);
    return;
  }
  const discordId = message.author.id;
  const scoreAttackUser = await connect(ScoreAttackUsers, (repository) =>
    repository.findOne({ discordId }),
  );
  if (typeof scoreAttackUser === 'undefined') {
    await message.channel.send(
      `<@!${discordId}> Sparebeatと連携してないっぽいから\n\`\`\`\n!register (SparebeatのユーザーID)\n\`\`\`でSparebeatアカウントと連携しよう！`, // eslint-disable-line max-len
    );
    return;
  }
  const scoreInfo = await fetchLatestScoreInfo(scoreAttackUser.sparebeatName, current);
  if (typeof scoreInfo === 'undefined') {
    await message.channel.send(
      `<@!${discordId}> もしかしたらSparebeatのユーザーID変えたりしてない？\n\`\`\`\n!register (SparebeatのユーザーID)\n\`\`\`を変更後のユーザーIDでもう一回やってほしい！`, // eslint-disable-line max-len
    );
    return;
  }
  if (scoreInfo === null) {
    const difficulty = (['EASY', 'NORMAL', 'HARD'] as const)[current.difficulty - 1];
    await message.channel.send(
      `<@!${discordId}> 最後にタイムラインに投稿した譜面が違うかも？\n「${current.title}」の${difficulty}譜面をプレイしてタイムラインに投稿してください！\n譜面URL: ${current.url}`, // eslint-disable-line max-len
    );
    return;
  }
  if (dayjs(scoreInfo.scoreCreatedAt).isBefore(dayjs().subtract(1, 'minute'))) {
    await message.channel.send(
      `<@!${discordId}> タイムラインに投稿してから1分以内のやつじゃないとだめだー`,
    );
    return;
  }
  const scoreInHistories = await connect(ScoreAttackHistories, (repository) =>
    repository.findOne({ discordId, guildId }, { order: { historyId: 'DESC' } }),
  );
  if (typeof scoreInHistories !== 'undefined') {
    if (scoreInHistories.scoreCreatedAt === scoreInfo.scoreCreatedAt) {
      await message.channel.send(`<@!${discordId}> 何回も\`!score\`するのはやめようね！`);
      return;
    }
    scoreInHistories.score = scoreInfo.score;
    scoreInHistories.scoreCreatedAt = scoreInfo.scoreCreatedAt;
    await connect(ScoreAttackHistories, (repository) => repository.save(scoreInHistories));
    await sendScoreMessage(message, current, scoreInfo);
    return;
  }
  await insert(message, current, scoreInfo);
};

const fetchLatestScoreInfo = async (sparebeatName: string, current: ScoreAttackSongs) => {
  try {
    const { data } = await axios.get<PlayRecord[]>(`/api/users/${sparebeatName}/play-records`);
    if (data.length === 0) {
      return undefined;
    }
    const { score, createdAt, track, difficulty } = data[0];
    if (current.hash !== track.id || current.difficulty !== difficulty) {
      return null;
    }
    return { score, scoreCreatedAt: createdAt } as ScoreInfo;
  } catch {
    return undefined;
  }
};

const insert = async (message: Message, current: ScoreAttackSongs, scoreInfo: ScoreInfo) => {
  const insert = new ScoreAttackHistories();
  insert.update(current, scoreInfo);
  insert.guildId = (message.guild as Guild).id;
  insert.discordId = message.author.id;
  await connect(ScoreAttackHistories, (repository) => repository.save(insert));
  await sendScoreMessage(message, current, scoreInfo);
};

const sendScoreMessage = async (
  message: Message,
  current: ScoreAttackSongs,
  scoreInfo: ScoreInfo,
) => {
  const { displayName } = (message.guild as Guild).members.cache.find(
    ({ id }) => id === message.author.id,
  ) as GuildMember;
  const { title, url } = current;
  await message.channel.send({
    embed: {
      author: {
        name: `${displayName}くんのスコア！`,
        icon_url: message.author.avatarURL() || 'https://cdn.discordapp.com/embed/avatars/0.png',
      },
      title: `${scoreInfo.score}`,
      color: 0xce9eff,
      description: `タイトル: [${title}](${url})\n${getDescription(current)}`,
    },
  });
};

export { scoring };
