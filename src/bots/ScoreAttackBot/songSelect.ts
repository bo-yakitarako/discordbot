import { Guild, Message } from 'discord.js';
import { axios } from '.';
import { ScoreAttackSongs } from '../../entity/ScoreAttackSongs';
import { connect } from '../../utility';
import { Track, Tracks, PlayAPI, SongTable } from './types';

const setSong = async (message: Message) => {
  const params = message.content.split(' ');
  const mention = `<@!${message.author.id}>`;
  if (params.length < 3) {
    await message.channel.send(`${mention} 曲の設定方法が違うかも！\n\`!sethelp\`で確認してみてね`);
    return;
  }
  const difficluty = parseDifficulty(params[1]);
  if (typeof difficluty === 'undefined') {
    await message.channel.send(
      `${mention} 難易度の設定方法が違うかも！\n\`!sethelp\`で確認してみてね`,
    );
    return;
  }
  const isURL = /^https:\/\/beta.sparebeat.com\/play\/[a-f0-9]{8}$/.test(params[2]);
  const isHash = /^[a-f0-9]{8}$/.test(params[2]);
  if (isURL || isHash) {
    const data = await fetchSongInfoFromURL(params[2], difficluty, isURL);
    if (typeof data === 'undefined') {
      await message.channel.send(
        `${mention} ${
          isHash ? `ID: ${params[2]}` : 'そのURL'
        }の曲でその難易度の譜面は見つかりませんでした><`,
      );
      return;
    }
    await setSongTable(message, data);
    return;
  }
  await setBySearch(message);
};

const parseDifficulty = (param: string) => {
  switch (param.toLowerCase()) {
    case 'e':
    case 'easy':
    case '1':
      return 1;
    case 'n':
    case 'normal':
    case '2':
      return 2;
    case 'h':
    case 'hard':
    case '3':
      return 3;
    default:
      return undefined;
  }
};

const fetchSongInfoFromURL = async (url: string, difficluty: 1 | 2 | 3, isURL?: boolean) => {
  const hash = isURL ? url.split('/').reverse()[0] : url;
  try {
    const { data } = await axios.get<PlayAPI>(`/api/play/${hash}`);
    return parseTableData(data, difficluty);
  } catch {
    return undefined;
  }
};

const parseTableData = (apiData: PlayAPI, difficulty: 1 | 2 | 3) => {
  const { track, publisher } = apiData;
  const levelProps = ['levelEasy', 'levelNormal', 'levelHard'] as const;
  const level = track[levelProps[difficulty - 1]];
  if (level === 0) {
    return undefined;
  }
  return {
    title: track.title,
    url: `https://beta.sparebeat.com/play/${track.id}`,
    artist: track.artist,
    artistWebsite: track.url,
    hash: track.id,
    mapperName: publisher.name,
    mapperDisplayName: publisher.displayName || null,
    difficulty,
    level,
  };
};

const setSongTable = async (message: Message, data: SongTable) => {
  const guildId = (message.guild as Guild).id;
  const currentRow = await connect(ScoreAttackSongs, (repository) =>
    repository.findOne({ guildId }),
  );
  if (typeof currentRow !== 'undefined') {
    currentRow.update(data);
    await connect(ScoreAttackSongs, (repository) => repository.save(currentRow));
  } else {
    await connect(ScoreAttackSongs, (repository) => repository.save({ guildId, ...data }));
  }
  await message.channel.send({
    embed: {
      author: {
        name: '曲を設定しました！',
      },
      title: data.title,
      url: data.url,
      color: 0xce9eff,
      description: getDescription(data),
    },
  });
};

function getDescription<Data extends SongTable>(data: Data) {
  const difficulty = (['EASY', 'NORMAL', 'HARD'] as const)[data.difficulty - 1];
  const mapper =
    data.mapperDisplayName !== null
      ? `${data.mapperDisplayName} (${data.mapperName})`
      : `${data.mapperName}`;
  return `作曲者: ${
    data.artistWebsite ? ` [${data.artist}](${data.artistWebsite})` : data.artist
  }\n難易度: ${difficulty}(${
    data.level
  })\n譜面製作者: [${mapper}](https://beta.sparebeat.com/users/${data.mapperName})`;
}

const setBySearch = async (message: Message) => {
  const params = message.content.split(' ');
  const difficluty = parseDifficulty(params[1]) as 1 | 2 | 3;
  const targets = params.slice(2);
  const tracks = await fetchTracks();
  const hits = tracks.filter((track) => {
    const levelProps = ['levelEasy', 'levelNormal', 'levelHard'] as const;
    return (
      track[levelProps[difficluty - 1]] > 0 &&
      targets.every((target) => track.title.toLowerCase().includes(target.toLowerCase()))
    );
  });
  const mention = `<@!${message.author.id}>`;
  if (hits.length === 0) {
    await message.channel.send(
      `${mention} 難易度「${['EASY', 'NORMAL', 'HARD'][difficluty - 1]}」で「${targets.join(
        ' ',
      )}」を含むタイトルは無いみたいだよ`,
    );
    return;
  }
  if (hits.length === 1) {
    const data = (await fetchSongInfoFromURL(hits[0].id, difficluty)) as SongTable;
    await setSongTable(message, data);
    return;
  }
  await sendSelectMessage(message, hits, targets, difficluty);
};

const fetchTracks = async () => {
  let page = 1;
  let currentTracks = await fetchPageTracks();
  let tracks: Track[] = [];
  while (currentTracks.length > 0) {
    tracks = [...tracks, ...currentTracks];
    currentTracks = await fetchPageTracks(page); // eslint-disable-line no-await-in-loop
    page += 1;
  }
  return tracks;
};

const fetchPageTracks = async (page?: number) => {
  const path = `/api/tracks/${page ? `recently?page=${page}` : 'home'}`;
  try {
    const { data } = await axios.get<Tracks>(path);
    return data.tracks;
  } catch {
    return [];
  }
};

const sendSelectMessage = async (
  message: Message,
  hits: Track[],
  targets: string[],
  difficluty: 1 | 2 | 3,
) => {
  if (hits.length > 20) {
    await message.channel.send(`<@!${message.author.id}> 検索結果が多すぎて無理だ〜😫`);
    return;
  }
  await message.channel.send({
    embed: {
      title: '曲を選択してください！',
      description: `「${targets.join(' ')}」を含むタイトルが${
        hits.length
      }件見つかりました！\nやりたい曲を以下から選択し、コマンドをコピーしてそのまんま貼り付けてください！`,
      color: 0xce9eff,
      fields: hits.map(({ title, id }, index) => {
        return {
          name: `${index + 1}: ${title}`,
          value: `\`!set ${difficluty} ${id}\``,
        };
      }),
    },
  });
};

export { setSong, getDescription };
