import { timeFormat, timeParse, utcFormat, utcParse, format } from 'd3';

export const dateFormatSpecifier = '%m/%d/%Y';
export const dateFormat = timeFormat(dateFormatSpecifier);
export const dateFormatParser = timeParse(dateFormatSpecifier);

export const dateUTCFormatSpecifier = '%Y-%m-%d %H:%M:%S.%L';
export const dateUTCFormat = utcFormat(dateUTCFormatSpecifier);
export const dateUTCFormatParser = utcParse(dateUTCFormatSpecifier);

export const numberFormat = format('.2f');
