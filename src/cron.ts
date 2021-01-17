import { Client, Guild, TextChannel } from 'discord.js';
import { config } from 'dotenv';
import { getFortune, sendResult } from './bots/OmikujiBot';
import { BoResult } from './entity/BoResult';
import { Omikuji } from './entity/Omikuji';
import { connect } from './utility';

config();
const OMIKUJI_TOKEN = process.env.TEST_TOKEN as string;
const MARUOKUN_ID = process.env.MARUOKUN_ID as string;
const CHANNEL_ID = process.env.MAIN_CHANNEL_ID as string;
const userId = '718705193373532160';

const client = new Client();
client.on('ready', () => onReady());

const onReady = async () => {
  const fortune = getFortune();
  const boResult = (await connect(Omikuji, (repository) => repository.findOne({ userId }))) as Omikuji;
  boResult[fortune] += 1;
  await connect(Omikuji, (repository) => repository.save(boResult));
  await connect(BoResult, (repository) => repository.save({ id: 1, result: fortune }));
  const guild = client.guilds.cache.find(({ id }) => id === MARUOKUN_ID) as Guild;
  const channel = guild.channels.cache.find(({ id }) => id === CHANNEL_ID) as TextChannel;
  await sendResult(channel, fortune);
  client.destroy();
};

client.login(OMIKUJI_TOKEN);
