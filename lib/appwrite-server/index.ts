import { config } from "@/lib/config";
import { Client, Account, Databases, TablesDB } from "node-appwrite";

// Create an ADMIN client to perform the elevated operation.
const clientServer = new Client()
  .setEndpoint(config.APPWRITE_ENDPOINT)
  .setProject(config.APPWRITE_PROJECT_ID)
  .setKey(config.APPWRITE_API_KEY);

const accountServer = new Account(clientServer);
const tablesDbServer = new TablesDB(clientServer);

export { clientServer, accountServer, tablesDbServer };

export class AppwriteServer {
  // Create an USER client for verification.
  public client: Client;
  public account: Account;
  public database: Databases;
  constructor() {
    this.client = new Client()
      .setEndpoint(config.APPWRITE_ENDPOINT)
      .setProject(config.APPWRITE_PROJECT_ID);
    this.account = new Account(this.client);
    this.database = new Databases(this.client);
  }
}
