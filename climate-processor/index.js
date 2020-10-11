// SELECT * as payload, topic() as topic, topic(3) as thingname, timestamp() as timestamp from 'home/thing/+/climate'

const AWS = require('aws-sdk');
const timestreamwrite = new AWS.TimestreamWrite();

exports.handler = async function(event, context) {
    const { topic, payload, thingname, timestamp } = event;
}



function wrie() {
    
    const params = {
        DatabaseName: '',
        TableName: '',
        Records: [{
            MeasureName: '',
            MeasureValue: '',
            Time: '',
            Dimensions: [
                {Name: '', Value: ''},
            ],
        }],
    };
    return await timestreamwrite.writeRecords(params).promise();
}