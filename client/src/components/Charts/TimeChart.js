import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import Card, { CardContent } from 'material-ui/Card';
const TimeChart = ({chartData}) =>{
  var displayData = [];
  var dataMax = 0;
  for (let i = 0; i < chartData.rows.length; i++) {
    var rec = chartData.rows[i];
    displayData[i] = {'datetime': convertTime(rec.datetime),'count':rec.count};
    if(parseInt(rec.count, 10) > dataMax){
      dataMax = parseInt(rec.count,10);
    }
  }
    dataMax = dataMax + 5;
    return (
      <div>
        <Card >
          <CardContent >
            <LineChart width={1170} height={200} data={displayData}
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <XAxis dataKey="datetime" />
              <YAxis domain={[0, dataMax]}/>
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Line type="natural" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </CardContent>
        </Card>
      </div >
    );
    function convertTime(date) {
      var hold = new Date(date);
      var hours = hold.getHours();
      var minutes = hold.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    }
  }
export default TimeChart;