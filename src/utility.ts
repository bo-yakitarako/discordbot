import { config } from 'dotenv';
import {
  createConnection,
  EntityTarget,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  getRepository,
  Repository,
} from 'typeorm';

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

function find<Entity>(
  entity: EntityTarget<Entity>,
  option: FindOneOptions<Entity>,
): Promise<Entity[]>;

function find<Entity>(
  entity: EntityTarget<Entity>,
  option: FindManyOptions<Entity>,
): Promise<Entity[]>;

function find<Entity>(
  entity: EntityTarget<Entity>,
  conditions: FindConditions<Entity>,
): Promise<Entity[]>;

async function find<Entity>(
  entity: EntityTarget<Entity>,
  option: FindOneOptions<Entity> | FindManyOptions<Entity> | FindConditions<Entity>,
) {
  return connect(entity, (repository) => repository.find(option));
}

function findOne<Entity>(
  entity: EntityTarget<Entity>,
  conditions?: FindConditions<Entity>,
): Promise<Entity | undefined>;

function findOne<Entity>(
  entity: EntityTarget<Entity>,
  conditions?: FindConditions<Entity>,
  option?: FindOneOptions<Entity>,
): Promise<Entity | undefined>;

async function findOne<Entity>(
  entity: EntityTarget<Entity>,
  conditions?: FindConditions<Entity>,
  option?: FindOneOptions<Entity>,
) {
  return connect(entity, (repository) => repository.findOne(conditions, option));
}

export { isDevelopment, connect, find, findOne };
