// SELECT * as payload, topic() as topic, topic(3) as thingname, timestamp() as timestamp from 'home/thing/+/climate'

const AWS = require('aws-sdk');
const timestreamwrite = new AWS.TimestreamWrite();

const { TS_TABLE_NAME, TS_DB_NAME } = process.env;

exports.handler = async function(event, context) {
  const { payload, thingname, timestamp } = event;

  const measures = ['tempf', 'humidity'];
  const records = measures.filter(measure => payload.hasOwnProperty(measure))
    .map(measure => ({
      MeasureName: measure,
      MeasureValue: payload[measure],
    }));

  if (!records.length) {
    console.log('No measures provided!');
    return;
  }
    
  const params = {
    DatabaseName: TS_DB_NAME,
    TableName: TS_TABLE_NAME, 
    Records: records,
    CommonAttributes: {
      Dimensions: {
        Name: 'device', Value: thingname,
        Name: 'sensor', Value: payload.sensor,
      },
      Time: timestamp,
    },
  };
  try {
    const res = await timestreamwrite.writeRecords(params).promise();
    console.log(res);
  } catch(err) {
    console.log('Error writing to Timestream');
    console.log(err);
    throw err;
  }
}