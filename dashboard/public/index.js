const dateUTCFormatSpecifier = '%Y-%m-%d %H:%M:%S.%L';
const dateUTCFormat = d3.utcFormat(dateUTCFormatSpecifier);
const dateUTCFormatParser = d3.utcParse(dateUTCFormatSpecifier);

var dataVar; // eslint-disable-line

d3.csv('./MirafloresAlertsTest.csv').then(data => {
  dataVar = data;
  data.forEach(d => {
    const entry = d;
    entry.interactions = +d.interactions;
    entry.longitude = +d.longitude;
    entry.latitude = +d.latitude;
    entry.start_time = dateUTCFormatParser(d.start_time);
    entry.end_time = dateUTCFormatParser(d.end_time);
    entry.reliability = +d.reliability;
    entry.confidence = +d.confidence;
    entry.magvar = +d.magvar;
    entry.duration_min = +d.duration_min;
    entry.hours = d3.utcHour.range(
      d3.utcHour(d.start_time),
      d3.utcHour.offset(d3.utcHour(d.end_time))
    );
    console.log(entry);
  });
});
