process.env.TS_DB_NAME = 'home-iot';
process.env.TS_TABLE_NAME = 'climate';
process.env.Region = 'us-east-2';

const app = require('./index.js');

(async function () {
  const event = {
    payload: {
      tempf: 97.1,
      humidity: 50,
      sensor: 'DHT22-mock'
    },
    thingname: 'test',
    timestamp: 1602442718830,
  }
  await app.handler(event, {});
})();