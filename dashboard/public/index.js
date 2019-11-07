const dateUTCFormatSpecifier = '%Y-%m-%d %H:%M:%S.%L';
const dateUTCFormat = d3.utcFormat(dateUTCFormatSpecifier);
const dateUTCFormatParser = d3.utcParse(dateUTCFormatSpecifier);

d3.csv('http://127.0.0.1:8080/MirafloresAlertsTest.csv').then(data => {
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
    console.log(entry);
  });
});
