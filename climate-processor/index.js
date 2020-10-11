// SELECT * as payload, topic() as topic, topic(3) as thingname, timestamp() as timestamp from 'home/thing/+/climate'

const { Region, TS_TABLE_NAME, TS_DB_NAME } = process.env;

const AWS = require('aws-sdk');
AWS.config.update({ region: Region });
const timestreamwrite = new AWS.TimestreamWrite();


exports.handler = async function(event, context) {
  const { payload, thingname, timestamp } = event;

  const measures = ['tempf', 'humidity'];
  const records = measures.filter(measure => payload.hasOwnProperty(measure))
    .map(measure => ({
      MeasureName: measure,
      MeasureValue: String(payload[measure]),
      MeasureValueType: 'DOUBLE',
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
      Dimensions: [
        { Name: 'device', Value: thingname },
        { Name: 'sensor', Value: payload.sensor },
      ],
      Time: String(timestamp),
      TimeUnit: 'MILLISECONDS',
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