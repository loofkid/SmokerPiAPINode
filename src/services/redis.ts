import { createClient } from "redis";

export const redisConfig = {
    url: 'redis://loofkid:Take-Grew-Unhelpful-Espresso-Embolism-Serve@10.13.13.16'
}

export const connectClient = async () => {
    const redisClient = createClient(redisConfig);
    redisClient.on('error', (err) => console.log("Redis Client Error", err));
    await redisClient.connect();

    client = redisClient;
}

export let client: ReturnType<typeof createClient>;