import { MongoClient, type Db } from "mongodb";

const globalForMongo = globalThis as unknown as {
  mongo?: Promise<MongoClient>;
  mongoIndexes?: Promise<void>;
};

export class PortalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PortalError";
  }
}

async function ensureIndexes(db: Db) {
  const agreements = db.collection("agreements");
  await agreements.createIndex({ landlordToken: 1 }, { unique: true });
  await agreements.createIndex({ tenantToken: 1 }, { unique: true });
  await agreements.createIndex({ updatedAt: -1 });
  await db.collection("templateConfigs").createIndex({ slug: 1 }, { unique: true });
}

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new PortalError("Set MONGODB_URI in .env.local and restart the server.");

  if (!globalForMongo.mongo) {
    const client = new MongoClient(uri);
    globalForMongo.mongo = client.connect().catch((error: unknown) => {
      globalForMongo.mongo = undefined;
      throw error;
    });
  }

  try {
    const client = await globalForMongo.mongo;
    const db = client.db(process.env.MONGODB_DB || "agreement_portal");
    if (!globalForMongo.mongoIndexes) {
      globalForMongo.mongoIndexes = ensureIndexes(db).catch((error: unknown) => {
        globalForMongo.mongoIndexes = undefined;
        throw error;
      });
    }
    await globalForMongo.mongoIndexes;
    return db;
  } catch (error) {
    if (error instanceof PortalError) throw error;
    console.error(error);
    throw new PortalError("Could not reach MongoDB. Check MONGODB_URI in .env.local.");
  }
}
