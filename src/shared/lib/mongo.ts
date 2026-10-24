import dns from 'node:dns';

import mongoose from 'mongoose';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 1000;

class MongoClientManager {
  private isConnected = false;

  /**
   * Optional DNS override (comma-separated, e.g. "8.8.8.8,1.1.1.1") for environments where Node's
   * default resolver cannot answer the SRV lookups that mongodb+srv:// URIs need.
   */
  private applyDnsServers(): void {
    const servers = process.env.DNS_SERVERS?.split(',').map((server) => server.trim()).filter(Boolean);
    if (servers?.length) dns.setServers(servers);
  }

  async connect(retries = MAX_RETRIES): Promise<void> {
    if (this.isConnected) return;
    this.applyDnsServers();
    try {
      await mongoose.connect(process.env.MONGO_URI!);
      this.isConnected = true;
      console.log('Connected to MongoDB');
    } catch (error) {
      if (retries <= 0) throw error;
      console.warn(`MongoDB connection failed, retrying... (${MAX_RETRIES - retries + 1}/${MAX_RETRIES})`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      return this.connect(retries - 1);
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
    }
  }
}

export const mongo = new MongoClientManager();
export { MongoClientManager };
