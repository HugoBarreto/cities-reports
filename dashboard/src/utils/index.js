import { timeFormat, timeParse, utcFormat, utcParse, format } from 'd3';

export const dateFormatSpecifier = '%m/%d/%Y';
export const dateFormat = timeFormat(dateFormatSpecifier);
export const dateFormatParser = timeParse(dateFormatSpecifier);

export const dateUTCFormatSpecifier = '%Y-%m-%d %H:%M:%S.%L';
export const dateUTCFormat = utcFormat(dateUTCFormatSpecifier);
export const dateUTCFormatParser = utcParse(dateUTCFormatSpecifier);

export const numberFormat = format('.2f');

export function parseAlertTypeSubtype(type, subtype) {
  switch (type) {
    case 'ACCIDENT':
      return 'accident';
    case 'JAM':
      return 'jam';
    case 'WEATHERHAZARD':
      switch (subtype) {
        case 'HAZARD_ON_ROAD_POT_HOLE':
          return 'potHole';
        case 'HAZARD_WEATHER_FLOOD':
          return 'flood';
        case 'HAZARD_ON_ROAD_TRAFFIC_LIGHT_FAULT':
          return 'trafficLight';
        default:
          return 'others';
      }
    default:
      return 'others';
  }
}

export function last(array) {
  return array[array.length - 1];
}

export function getLastSunday() {
  const d = new Date();
  d.setUTCHours(11, 0, 0);
  d.setDate(d.getUTCDate() - d.getUTCDay());
  return d;
}

export function getSundayBefore(sunday) {
  const d = new Date(sunday.getTime());
  d.setUTCDate(d.getUTCDate() - 7);
  return d;
}

function parseNumberToPercentage(num) {
  return Number(num).toLocaleString(undefined, {
    style: 'percent',
    minimumFractionDigits: 1,
  });
}

export function getPercentage(currValue, oldValue) {
  if (oldValue === 0) {
    return parseNumberToPercentage(0);
  }
  return parseNumberToPercentage((currValue - oldValue) / oldValue);
}

export function getStatLabel(type) {
  switch (type) {
    case 'ACCIDENT':
      return 'Accident';
    case 'JAM':
      return 'Jam';
    case 'HAZARD_ON_ROAD_POT_HOLE':
      return 'Pot Hole';
    case 'HAZARD_WEATHER_FLOOD':
      return 'Flood';
    case 'HAZARD_ON_ROAD_TRAFFIC_LIGHT_FAULT':
      return 'Traffic Light';
    default:
      return 'others';
  }
}
