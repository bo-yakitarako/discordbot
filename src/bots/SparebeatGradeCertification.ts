import { Message, Collection, Role, GuildMember, Guild } from 'discord.js';
import fetch from 'node-fetch';
import { Bot } from './Bot';

type GradeId =
  | 'class5'
  | 'class4'
  | 'class3'
  | 'class2'
  | 'class1'
  | 'grade1'
  | 'grade2'
  | 'grade3'
  | 'grade4'
  | 'grade5'
  | 'grade6'
  | 'grade7'
  | 'grade8'
  | 'grade9'
  | 'grade10'
  | 'master'
  | 'world';
interface IResult {
  requirement: number;
  songs: {
    title: string;
    url: string;
    difficulty: string;
    level: string;
  }[];
  challenge: boolean;
  scores: [number, number, number, number];
  gradeScore: number;
  successful: boolean;
}
type Status = {
  [key in GradeId]: IResult;
};

const gradeName: { [key in GradeId]: string } = {
  class5: '五級',
  class4: '四級',
  class3: '三級',
  class2: '二級',
  class1: '一級',
  grade1: '初段',
  grade2: '二段',
  grade3: '三段',
  grade4: '四段',
  grade5: '五段',
  grade6: '六段',
  grade7: '七段',
  grade8: '八段',
  grade9: '九段',
  grade10: '十段',
  master: '名人',
  world: '天下',
};

class SparebeatGradeCertification extends Bot {
  protected ready(): void {
    console.log('SGC稼働なう');
  }

  protected message(message: Message): void {
    if (message.author.bot) {
      return;
    }
    if (message.content === '!gradehelp') {
      this.showHelp(message);
    } else if (message.content === '!gradehelp link') {
      this.showLinkHelp(message);
    } else if (message.content === '!gradehelp id') {
      this.showGradeIdHelp(message);
    } else if (message.content === '!create roles') {
      this.createRole(message);
    } else if (message.content.startsWith('!status')) {
      this.checkStatus(message);
    } else if (message.content === '!request') {
      this.giveRoles(message);
    }
  }

  private async checkStatus(message: Message) {
    const params = message.content.split(' ');
    const mention = `<@${message.author.id}>`;
    if (params.length < 2 || !Object.keys(gradeName).includes(params[1])) {
      message.channel.send(`${mention} ちょっとよくわからない`);
      return;
    }
    const status = await this.fetchStatus(message);
    if (!status) {
      return;
    }
    const gradeId = params[1] as GradeId;
    const { requirement, songs, challenge, scores, gradeScore, successful } = status[gradeId];
    if (!challenge) {
      message.channel.send(`${mention} ${gradeName[gradeId]}はやったことないっぽいです`);
      return;
    }
    const { displayName } = (message.guild as Guild).member(message.author) as GuildMember;
    message.channel.send({
      embed: {
        title: `「${displayName}」${gradeName[gradeId]}`,
        color: 0xce9eff,
        thumbnail: {
          url: 'https://sgc.bo-yakitarako.com/sgc.png',
        },
        description:
          `[${gradeName[gradeId]}の詳細](https://sgc.bo-yakitarako.com/detail/${gradeId})\n` +
          `スコア: **${gradeScore} / ${requirement}**\n` +
          `**${successful ? '合格' : '不合格'}**\n`,
        fields: songs.map(({ title, difficulty, level }, index) => ({
          name: `${index + 1}曲目`,
          value: `**${title}**\n${difficulty.toUpperCase()}(${level})\nスコア: ${scores[index]}`,
        })),
      },
    });
  }

  private async fetchStatus(message: Message): Promise<Status | undefined> {
    const response = await fetch(`https://sgc.bo-yakitarako.com/data/discord/${message.author.id}`);
    const status: Status | boolean = await response.json();
    if (typeof status === 'boolean') {
      const mention = `<@${message.author.id}>`;
      message.channel.send(
        `${mention} このアカウントは段位認定との連携やってないみたい！\n\`\`\`!gradehelp link\`\`\`で連携方法を確認できます！`,
      );
      return undefined;
    }
    return status;
  }

  private async giveRoles(message: Message) {
    const status = await this.fetchStatus(message);
    if (status === undefined) {
      return;
    }
    if (!message.guild) {
      return;
    }
    const roleList = message.guild.roles.cache;
    const unavailableRoles = this.checkUnavailableGradeRole(roleList);
    if (unavailableRoles.length > 0) {
      message.channel.send(
        `${unavailableRoles
          .map((roleName) => `「**${roleName}**」`)
          .join('と')}の役職がないよう><\n` +
          '```!create roles```のコマンドで無いやつを作っちゃいます',
      );
      return;
    }
    const member = message.guild.member(message.author) as GuildMember;
    const memberRoles = member.roles.cache;
    const toRemove = this.getRemovingGradeIds(status, memberRoles);
    toRemove.forEach((roleName) => {
      member.roles.remove(roleList.find(({ name }) => name === roleName) as Role);
    });
    const toAdd = this.getAddingGradeIds(status, memberRoles);
    const mention = `<@${message.author.id}>`;
    if (toAdd.length === 0) {
      message.channel.send(`${mention} 今付与できる段位役職はないよん`);
      return;
    }
    toAdd.forEach((roleName) => {
      member.roles.add(roleList.find(({ name }) => name === roleName) as Role);
    });
    const addedRoleName = toAdd.map((roleName) => `「**${roleName}**」`).join('と');
    message.channel.send(`${mention} ${addedRoleName}を付与しました！`);
  }

  private checkUnavailableGradeRole(roleList: Collection<string, Role>) {
    return (Object.keys(gradeName) as GradeId[]).reduce((pre, gradeId) => {
      if (roleList.find((role) => role.name === `SGC${gradeName[gradeId]}`) === undefined) {
        return [...pre, `SGC${gradeName[gradeId]}`];
      }
      return [...pre];
    }, [] as string[]);
  }

  private getAddingGradeIds(status: Status, memberRoles: Collection<string, Role>) {
    return (Object.keys(gradeName) as GradeId[]).reduce((pre, gradeId) => {
      if (
        memberRoles.find(({ name }) => name === `SGC${gradeName[gradeId]}`) !== undefined ||
        !status[gradeId].successful
      ) {
        return [...pre];
      }
      return [...pre, `SGC${gradeName[gradeId]}`];
    }, [] as string[]);
  }

  private getRemovingGradeIds(status: Status, memberRoles: Collection<string, Role>) {
    return (Object.keys(gradeName) as GradeId[]).reduce((pre, gradeId) => {
      if (
        memberRoles.find(({ name }) => name === `SGC${gradeName[gradeId]}`) !== undefined &&
        !status[gradeId].successful
      ) {
        return [...pre, `SGC${gradeName[gradeId]}`];
      }
      return [...pre];
    }, [] as string[]);
  }

  private createRole(message: Message) {
    const { roles } = message.guild as Guild;
    const unavailableRoles = this.checkUnavailableGradeRole(roles.cache);
    if (unavailableRoles.length === 0) {
      message.channel.send('役職 is already...');
      return;
    }
    unavailableRoles.forEach((roleName) => {
      roles.create({
        data: {
          name: roleName,
          color: '#ce9eff',
        },
      });
    });
    message.channel.send(
      `${unavailableRoles
        .map((roleName) => `「**${roleName}**」`)
        .join('と')}の役職を作成しました！`,
    );
  }

  private showHelp(message: Message) {
    message.channel.send({
      embed: {
        title: 'ヘルプ',
        color: 0xce9eff,
        thumbnail: {
          url: 'https://sgc.bo-yakitarako.com/sgc.png',
        },
        description:
          // eslint-disable-next-line max-len
          '**!gradehelp link**\n段位認定との連携方法に関するヘルプを表示します\n[認証ページはここから](https://discord.com/api/oauth2/authorize?client_id=718706299826864139&redirect_uri=https%3A%2F%2Fsgc.bo-yakitarako.com%2Fdiscord%2Fauthorize&response_type=code&scope=identify)\n\n' +
          '**!gradehelp id**\n段位IDと各段位との照合です\n\n' +
          '**!status <段位ID>**\n指定した段位IDの現状を表示します\n初段の例) ``!status grade1``\n\n' +
          '**!request**\n段位役職を付与します\n\n' +
          '**!create roles**\n「SGC五級」〜「SGC天下」までの役職を作成します',
      },
    });
  }

  private showLinkHelp(message: Message) {
    message.channel.send({
      embed: {
        title: '段位認定との連携方法',
        color: 0xce9eff,
        thumbnail: {
          url: 'https://sgc.bo-yakitarako.com/sgc.png',
        },
        description:
          // eslint-disable-next-line max-len
          '1. [Discord認証ページ](https://discord.com/api/oauth2/authorize?client_id=718706299826864139&redirect_uri=https%3A%2F%2Fsgc.bo-yakitarako.com%2Fdiscord%2Fauthorize&response_type=code&scope=identify)からDiscordのアカウントを認証する\n\n' +
          '2. Twitterの認証が済んでいない場合はTwitterの認証に飛ぶのでTwitterでも認証する\n\n' +
          '3. 左側にDiscordアカウントのアイコン、右側にTwitterアカウントのアイコンが表示されているページが表示されれば連携完了！\n\n' +
          '一度連携すれば再び連携する必要はありません。いっぱい段位取ってみんなで盛り上がっちゃおうね〜',
      },
    });
  }

  private showGradeIdHelp(message: Message) {
    const description = `「段位名」=>「段位ID」\n\n${(Object.keys(gradeName) as GradeId[])
      .map((gradeId) => `${gradeName[gradeId]} => ${gradeId}`)
      .join('\n')}`;
    message.channel.send({
      embed: {
        title: '各段位の段位ID',
        color: 0xce9eff,
        thumbnail: {
          url: 'https://sgc.bo-yakitarako.com/sgc.png',
        },
        description,
      },
    });
  }
}

export { SparebeatGradeCertification };
