import { createClient, RedisClientType } from 'redis';

class Database {
    public client: RedisClientType;

    constructor() {
        this.client = createClient();
    }

    async connect(): Promise<boolean> {
        await this.client.connect();
        return true;
    }
}

export default new Database();
