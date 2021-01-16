import { Client, Message } from 'discord.js';
import { createConnection, EntityTarget, getRepository, Repository } from 'typeorm';

type Callback<Entity, Res> = (respository: Repository<Entity>) => Promise<Res>;

abstract class BotBase {
  /** 必ずonMessageの最初に代入する */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  protected message: Message;

  protected abstract onReady(): void;
  protected abstract onMessage(message: Message): void;

  public launch(token: string) {
    const client = new Client();
    client.on('ready', () => this.onReady());
    client.on('message', (message) => this.onMessage(message));
    client.login(token);
  }

  protected async connect<Entity, Res>(entity: EntityTarget<Entity>, callback: Callback<Entity, Res>) {
    const connection = await createConnection();
    const repository = getRepository(entity);
    const responce = await callback(repository);
    connection.close();
    return responce;
  }
}

export { BotBase, Callback };
