import { Guild, Message } from 'discord.js';
import axiosBase from 'axios';
import { BotBase } from '../BotBase';
import { register, unregister } from './register';
import { getDescription, setSong } from './songSelect';
import { connect } from '../../utility';
import { ScoreAttackSongs } from '../../entity/ScoreAttackSongs';
import { scoring } from './scoring';
import { showRanking } from './ranking';
import { mainHelp, setHelp } from './help';

class ScoreAttackBot extends BotBase {
  protected onReady() {
    console.log('すこあたってしまうのですか！！？？');
  }

  protected onMessage(message: Message) {
    if (message.author.bot) {
      return;
    }
    if (message.content.startsWith('!register ')) {
      register(message);
    } else if (message.content === '!unregister') {
      unregister(message);
    } else if (message.content === '!sethelp') {
      message.channel.send({ embed: setHelp });
    } else if (message.content.startsWith('!set ')) {
      setSong(message);
    } else if (message.content === '!current') {
      this.sendCurrent(message);
    } else if (message.content === '!finish') {
      this.finish(message);
    } else if (message.content === '!score') {
      scoring(message);
    } else if (message.content.startsWith('!ranking')) {
      showRanking(message);
    } else if (message.content === '!attackhelp') {
      message.channel.send({ embed: mainHelp });
    }
  }

  private async sendCurrent(message: Message) {
    const guildId = (message.guild as Guild).id;
    const data = await connect(ScoreAttackSongs, (repository) => repository.findOne({ guildId }));
    if (typeof data === 'undefined') {
      await message.channel.send('今は何も設定されていないよ');
      return;
    }
    await message.channel.send({
      embed: {
        author: {
          name: '現在設定されている曲',
        },
        title: data.title,
        url: data.url,
        color: 0xce9eff,
        description: getDescription(data),
      },
    });
  }

  private async finish(message: Message) {
    const guildId = (message.guild as Guild).id;
    const data = await connect(ScoreAttackSongs, (repository) => repository.findOne({ guildId }));
    if (typeof data !== 'undefined') {
      await connect(ScoreAttackSongs, (repository) => repository.remove(data));
      await message.channel.send('みんなおつかれー');
    }
  }
}

export { ScoreAttackBot, axios };

const axios = axiosBase.create({
  baseURL: 'https://beta.sparebeat.com',
  headers: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'Content-Type': 'application/json',
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'X-Requested-With': 'XMLHttpRequest',
  },
  responseType: 'json',
});
