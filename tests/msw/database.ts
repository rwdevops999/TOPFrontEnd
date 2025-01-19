import { faker } from "@faker-js/faker";
import { factory, oneOf, primaryKey } from "@mswjs/data";
import { Repository } from "../../src/entities/repository";
import { Tutorial } from "../../src/entities/tutorial";
import { Setting } from "../../src/entities/setting";

export const database = factory({
  tutorial: {
    id: primaryKey(faker.number.int),
    description: faker.string.alpha,
    title: faker.string.alpha,
    published: faker.datatype.boolean,
    filename: faker.system.fileName,
  },
  repository: {
    id: primaryKey(faker.number.int),
    name: faker.string.alpha,
    selected: faker.datatype.boolean,
    favorite: faker.datatype.boolean,
    tutorials: faker.number.int,
    updatedate: faker.date.anytime,
  },
  file: {
    id: primaryKey(faker.number.int),
    tutorial: oneOf("tutorial"),
    type: faker.string.alpha,
    fileContent: faker.string.binary,
    repository: oneOf("repository"),
  },
  setting: {
    id: primaryKey(faker.number.int),
    key: faker.string.alpha,
    value: faker.string.alpha,
    type: faker.string.alpha,
  },
});

export const createDBTutorial = (tutorial: Tutorial): Tutorial => {
  let newTutorial = database.tutorial.create({
    ...tutorial,
  });

  return newTutorial;
};

export const createDBRepository = (repository: Repository): Repository => {
  let newRepository = database.repository.create({
    ...repository,
  });

  return newRepository;
};

export const createDBSetting = (setting: Setting): Setting => {
  let newSetting = database.setting.create({
    ...setting,
  });

  return newSetting;
};

let tutorialIds = new Array();
let repositoryIds = new Array();
let settingIds = new Array();

const defaultTutorial: Tutorial = {
  id: undefined,
  title: "Title 1",
  description: "Description 1",
  published: false,
  filename: "File 1",
};

const defaultRepository: Repository = {
  id: undefined,
  name: "Repo 1",
  selected: false,
  favorite: false,
  tutorials: 0,
  updateDate: new Date(),
};

const defaultSetting: Setting = {
  id: undefined,
  key: "Key1",
  value: "Value1",
  type: "Type1",
};

export const removeDBTutorials = () => {
  database.tutorial.deleteMany({ where: { id: { gt: 0 } } });
  tutorialIds = new Array();
};

export const removeDBRepositories = () => {
  database.repository.deleteMany({ where: { id: { gt: 0 } } });
  repositoryIds = new Array();
};

export const removeDBSettings = () => {
  database.setting.deleteMany({ where: { id: { gt: 0 } } });
  settingIds = new Array();
};

export const createTutorials = (
  num: number,
  remove: boolean = true,
  tutorial?: Tutorial
): void => {
  if (remove) {
    removeDBTutorials();
  }

  let count = database.tutorial.count();

  for (let i = count; i < count + num; i++) {
    let tut = {
      title: "Title " + i,
      description: "Description " + i,
      published: false,
      filename: "File " + i,
    };

    let { id } = createDBTutorial({
      ...defaultTutorial,
      ...tut,
      ...tutorial,
    });
    tutorialIds.push(id);
  }
};

export const createRepositories = (
  num: number,
  remove: boolean = true,
  repository?: Repository
) => {
  if (remove) {
    removeDBRepositories();
  }

  for (let i = 0; i < num; i++) {
    let { id } = createDBRepository({
      ...defaultRepository,
      ...repository,
    });
    repositoryIds.push(id);
  }
};

export const createSetting = (
  num: number,
  remove: boolean = true,
  setting?: Setting
) => {
  if (remove) {
    removeDBSettings();
  }

  for (let i = 0; i < num; i++) {
    let { id } = createDBSetting({
      ...defaultSetting,
      ...setting,
    });
    settingIds.push(id);
  }
};
export const getDBTutorialByIndex = (index: number): Tutorial => {
  return database.tutorial.findFirst({
    where: { id: { equals: tutorialIds[index] } },
  })!;
};

export const getDBRepositoryByIndex = (index: number): Repository => {
  return database.repository.findFirst({
    where: { id: { equals: repositoryIds[index] } },
  })!;
};

export const createNonPublishedTutorials = () => {
  removeDBTutorials();
};
