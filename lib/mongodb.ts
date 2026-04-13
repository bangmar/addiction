import type { Db } from "mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
export const DATABASE_NAME = "tracker";

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable.");
}

const options = {};

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const client = new MongoClient(uri, options);

function connectClient() {
  return client
    .connect()
    .then((connectedClient) => {
      if (process.env.NODE_ENV !== "production") {
        console.log(`[mongodb] Connected successfully to database \"${DATABASE_NAME}\".`);
      }

      return connectedClient;
    })
    .catch((error: unknown) => {
      console.error("[mongodb] Connection failed:", error);
      throw error;
    });
}

const clientPromise = globalThis._mongoClientPromise ?? connectClient();

if (process.env.NODE_ENV !== "production") {
  globalThis._mongoClientPromise = clientPromise;
}

export async function getDatabase(): Promise<Db> {
  const connectedClient = await clientPromise;
  return connectedClient.db(DATABASE_NAME);
}

export default clientPromise;
