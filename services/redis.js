const { createClient } = require("redis");

const redisConfig = {
    url: 'redis://loofkid:Take-Grew-Unhelpful-Espresso-Embolism-Serve@10.13.13.16'
}

const connectClient = async () => {
    const client = createClient(redisConfig);
    client.on('error', (err) => console.log("Redis Client Error", err));
    await client.connect();

    return client;
}

module.exports = {
    connectClient: connectClient,
}
