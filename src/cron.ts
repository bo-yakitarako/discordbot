import dayjs from 'dayjs';
import { Client, Guild, TextChannel } from 'discord.js';
import { config } from 'dotenv';
import { getFortune, sendResult } from './bots/OmikujiBot';
import { BoResult } from './entity/BoResult';
import { Omikuji } from './entity/Omikuji';
import { connect } from './utility';

config();
const OMIKUJI_TOKEN = process.env.OMIKUJI_ID as string;
const MARUOKUN_ID = process.env.MARUOKUN_ID as string;
const CHANNEL_ID = process.env.MAIN_CHANNEL_ID as string;
const userId = '718705193373532160';
const id = 1;

const client = new Client();
client.on('ready', () => onReady());

const onReady = async () => {
  const fortune = getFortune();
  await connect(Omikuji, (repository) => repository.increment({ userId }, fortune, 1));
  const { result } = (await connect(BoResult, (repository) =>
    repository.findOne({ id }),
  )) as BoResult;
  if (result === fortune) {
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');
    await connect(BoResult, (repository) => repository.save({ id, updatedAt: now }));
  } else {
    await connect(BoResult, (repository) => repository.save({ id, result: fortune }));
  }
  const guild = client.guilds.cache.find(({ id }) => id === MARUOKUN_ID) as Guild;
  const channel = guild.channels.cache.find(({ id }) => id === CHANNEL_ID) as TextChannel;
  await sendResult(channel, fortune);
  client.destroy();
};

client.login(OMIKUJI_TOKEN);
