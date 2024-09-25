import { ID, Models, Query } from "appwrite";
import { collections } from "../collections";
import { databaseId, databases } from "../config";

type Payload = {
  [key: string]: string | number | boolean | object | null | undefined; // Allow undefined values
};

interface DBService {
  create: (payload: Payload, id?: string) => Promise<Models.Document>;
  update: (id: string, payload: Payload) => Promise<Models.Document>;
  get: (id: string) => Promise<Models.Document>;
  list: (queries?: Query[]) => Promise<Models.DocumentList<Models.Document>>;
  delete: (id: string) => Promise<Record<string, never>>;
}

const db: Record<string, DBService> = {};

collections.forEach((col) => {
  db[col.name] = {
    create: async (payload, id = ID.unique()) =>
      await databases.createDocument(databaseId, col.id, id, payload),

    update: async (id, payload) =>
      await databases.updateDocument(databaseId, col.id, id, payload),

    get: async (id) => await databases.getDocument(databaseId, col.id, id),

    list: async (queries) => {
      const queryStrings = queries?.map((query) => query.toString());
      return await databases.listDocuments(databaseId, col.id, queryStrings);
    },

    delete: async (id) =>
      await databases.deleteDocument(databaseId, col.id, id),
  };
});

export default db;
