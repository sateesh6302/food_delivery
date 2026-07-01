import fs from "fs";
import path from "path";
import { defaultFoods } from "./seedData.js";

const DATA_DIR = path.resolve("local_db");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

const readData = (collection) => {
  const file = getFilePath(collection);
  if (!fs.existsSync(file)) {
    if (collection === "foods") {
      fs.writeFileSync(file, JSON.stringify(defaultFoods, null, 2), "utf8");
      return defaultFoods;
    }
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    return [];
  }
};

const writeData = (collection, data) => {
  fs.writeFileSync(getFilePath(collection), JSON.stringify(data, null, 2), "utf8");
};

export const localDb = {
  find: (collection, query = {}) => {
    const data = readData(collection);
    return data.filter(item => {
      for (let key in query) {
        if (item[key] !== query[key]) return false;
      }
      return true;
    });
  },
  findOne: (collection, query) => {
    const items = localDb.find(collection, query);
    return items.length > 0 ? items[0] : null;
  },
  findById: (collection, id) => {
    if (!id) return null;
    return localDb.findOne(collection, { _id: id.toString() });
  },
  save: (collection, item) => {
    const data = readData(collection);
    if (!item._id) {
      item._id = Date.now().toString();
    }
    data.push(item);
    writeData(collection, data);
    return item;
  },
  findByIdAndUpdate: (collection, id, update) => {
    if (!id) return null;
    const data = readData(collection);
    let updatedItem = null;
    const newData = data.map(item => {
      if (item._id === id.toString()) {
        updatedItem = { ...item, ...update };
        return updatedItem;
      }
      return item;
    });
    writeData(collection, newData);
    return updatedItem;
  },
  findByIdAndDelete: (collection, id) => {
    if (!id) return false;
    const data = readData(collection);
    const newData = data.filter(item => item._id !== id.toString());
    writeData(collection, newData);
    return true;
  }
};
