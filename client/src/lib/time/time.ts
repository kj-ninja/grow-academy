import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import duration from "dayjs/plugin/duration";
import isToday from "dayjs/plugin/isToday";
import relativeTime from "dayjs/plugin/relativeTime";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

export { type ConfigType } from "dayjs";

dayjs.extend(isToday);
dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.extend(tz);
dayjs.extend(advancedFormat);

export const DateTime = dayjs;
