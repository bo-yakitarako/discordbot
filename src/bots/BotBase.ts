import { Client, Guild, GuildMember, Message } from 'discord.js';

abstract class BotBase {
  protected abstract onReady(): void;
  protected abstract onMessage(message: Message): void;

  public launch(token: string) {
    const client = new Client();
    client.on('ready', () => this.onReady());
    client.on('message', (message) => this.onMessage(message));
    client.login(token);
  }

  protected getDisplayName(message: Message) {
    return ((message.guild as Guild).member(message.author) as GuildMember).displayName;
  }
}

export { BotBase };
