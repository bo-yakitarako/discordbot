import { config } from 'dotenv';
import { createConnection, EntityTarget, getRepository, Repository } from 'typeorm';

type Callback<Entity, Res> = (respository: Repository<Entity>) => Promise<Res>;

config();

const isDevelopment = () => {
  return process.env.debug === 'true';
};

async function connect<Entity, Res>(entity: EntityTarget<Entity>, callback: Callback<Entity, Res>) {
  const connection = await createConnection();
  const repository = getRepository(entity);
  const responce = await callback(repository);
  connection.close();
  return responce;
}

export { isDevelopment, connect };
