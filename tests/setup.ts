import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let consoleSpy;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, { dbName: "testDB" });
});

beforeEach(async () => {
  await (mongoose.connection.db as mongoose.mongo.Db).dropDatabase();
});

afterAll(async () => {
  consoleSpy.mockRestore();
  await mongoose.connection.close();
  await mongoServer.stop();
});
