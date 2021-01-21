import { Guild, GuildMember, Message } from 'discord.js';
import axiosBase from 'axios';
import { BotBase } from './BotBase';
import { connect } from '../utility';
import { ScoreAttackUsers } from '../entity/ScoreAttackUsers';

const axios = axiosBase.create({
  baseURL: 'https://beta.sparebeat.com',
  headers: {
    'Content-Type': 'application/json', // eslint-disable-line @typescript-eslint/naming-convention
    'X-Requested-With': 'XMLHttpRequest', // eslint-disable-line @typescript-eslint/naming-convention
  },
  responseType: 'json',
});

class ScoreAttackBot extends BotBase {
  protected onReady() {
    console.log('すこあた起動マン');
  }

  protected onMessage(message: Message) {
    if (message.author.bot) {
      return;
    }
    if (message.content.startsWith('!register')) {
      this.register(message);
    }
  }

  private async register(message: Message) {
    const sparebeatName = message.content.split(' ')[1];
    const discordId = message.author.id;
    const reply = `<@!${discordId}>`;
    if (!sparebeatName) {
      await message.channel.send(`${reply} よくわかんないよー><`);
      return;
    }
    const sparebeatDisplayName = await this.getSparebeatDisplayName(sparebeatName);
    if (typeof sparebeatDisplayName === 'undefined') {
      await message.channel.send(`${reply} 「${sparebeatName}」というユーザーはSparebeatに登録されていないようです！`);
      return;
    }
    const registeredName = await this.getDiscordDisplayNameFromSparebeatName(message, sparebeatName);
    if (typeof registeredName !== 'undefined') {
      await message.channel.send(
        `${reply} Sparebeatユーザー「${sparebeatDisplayName}」は既にこの鯖にいる${registeredName}さんと連携されてるので新しく紐付けることはできません！`,
      );
      return;
    }
    await connect(ScoreAttackUsers, async (repository) => repository.save({ discordId, sparebeatName }));
    await message.channel.send(`${reply} Sparebeatアカウント「${sparebeatDisplayName}」と連携しました！`);
  }

  private async getSparebeatDisplayName(sparebeatName: string) {
    try {
      const { data } = await axios.get<SparebeatProfile>(`/api/users/${sparebeatName}`);
      return data.displayName || sparebeatName;
    } catch {
      return undefined;
    }
  }

  private async getDiscordDisplayNameFromSparebeatName(message: Message, sparebeatName: string) {
    const usersInDB = await connect(ScoreAttackUsers, async (repository) => repository.find({ sparebeatName }));
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
  }
}

export { ScoreAttackBot };

type SparebeatProfile = {
  biography: string | null;
  displayName: string | null;
  isPublisher: boolean;
  name: string;
  website: string | null;
};
