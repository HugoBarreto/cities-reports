const dateUTCFormatSpecifier = '%Y-%m-%d %H:%M:%S.%L';
const dateUTCFormat = d3.utcFormat(dateUTCFormatSpecifier);
const dateUTCFormatParser = d3.utcParse(dateUTCFormatSpecifier);

var dataVar; // eslint-disable-line

d3.csv('./MirafloresAlertsTest.csv').then(data => {
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
  });
  console.log(data);
});

const data = [
  { id: 1, author: 'foo', tags: ['tag1', 'tag2', 'tag3'] },
  { id: 2, author: 'foo', tags: ['tag3'] },
  { id: 3, author: 'foo', tags: ['tag1'] },
  { id: 4, author: 'bar', tags: ['tag2', 'tag3'] },
  { id: 5, author: 'bar', tags: ['tag3'] },
  { id: 6, author: 'bar', tags: ['tag2', 'tag3'] },
  { id: 7, author: 'bar', tags: ['tag1', 'tag2'] },
];

// const cf = crossfilter(data);
// const dimension = cf.dimension(d => d.tags, true);
// const group = dimension.group().reduce();
// console.log(group.all());
