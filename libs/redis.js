const redis = require('redis')
let client = redis.createClient()
const chalk = require('chalk')
const {
    exec
} = require('child_process');
const bluebird = require('bluebird')

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const decorateClient = () => {
    client.getAsyncWrap = async (key) => {
        let val = await client.getAsync(key)
        try {
            return JSON.parse(val)
        } catch (e) {
            return val
        }
    }

    client.setWrap = async (key, val) => {
        if (typeof val === 'object') {
            val = JSON.stringify(val)
        }
        return client.set(key, val)
    }
}
decorateClient()

module.exports = {
    client,
    connect() {
        exec('redis-server')
        client.on("error", (err) => {
            console.log(`${chalk.red('---Failed to connect redis---')}`)
        });

        client.on("connect", () => {
            console.log(`${chalk.green('---Connect redis success---')}`)
        });
    }
}