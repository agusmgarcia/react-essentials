const dateRegexp = /(\d\d\d\d)-(\d\d)-(\d\d)/;

const maxDaysPerMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Adds a specified number of days to a given date string and returns the resulting date as a string.
 *
 * @param date - The input date in string format (ISO 8601 format is recommended).
 * @param days - The number of days to add to the input date. Can be positive or negative.
 * @returns The resulting date as a string after adding the specified number of days.
 */
export function addDays(date: string, days: number): string {
  const tmp = new Date(date);
  tmp.setUTCDate(tmp.getUTCDate() + days);
  return toString(tmp);
}

/**
 * Adds a specified number of months to a given date string and returns the resulting date as a string.
 *
 * @param date - The input date in string format (ISO 8601 format is recommended).
 * @param months - The number of months to add to the input date. Can be positive or negative.
 * @returns The resulting date as a string after adding the specified number of months.
 */
export function addMonths(date: string, months: number): string {
  const tmp = new Date(date);
  tmp.setUTCMonth(tmp.getUTCMonth() + months);
  return toString(tmp);
}

/**
 * Adds a specified number of years to a given date string and returns the resulting date as a string.
 *
 * @param date - The input date in string format (ISO 8601 format is recommended).
 * @param years - The number of years to add to the input date. Can be positive or negative.
 * @returns The resulting date as a string after adding the specified number of years.
 */
export function addYears(date: string, years: number): string {
  const tmp = new Date(date);
  tmp.setUTCFullYear(tmp.getUTCFullYear() + years);
  return toString(tmp);
}

/**
 * Clamps a given date string to ensure it falls within the specified minimum and maximum date range.
 *
 * @param date - The input date as a string in ISO 8601 format.
 * @param minDate - The minimum allowable date as a string in ISO 8601 format.
 * @param maxDate - The maximum allowable date as a string in ISO 8601 format.
 * @returns The clamped date as a string. If the input date is less than `minDate`, it returns `minDate`.
 * If the input date is greater than `maxDate`, it returns `maxDate`. Otherwise, it returns the input date.
 */
export function clamp(date: string, minDate: string, maxDate: string): string {
  return min(max(date, minDate), maxDate);
}

/**
 * Calculates the difference in days between two dates.
 *
 * @param endDate - The end date as a string in a format compatible with the `Date` constructor.
 * @param startDate - The start date as a string in a format compatible with the `Date` constructor.
 * @returns The number of days between the two dates, rounded up to the nearest whole number.
 *
 * @remarks
 * This function assumes that the input date strings are valid and properly formatted.
 * It calculates the difference in milliseconds between the two dates and converts it to days.
 * The result is rounded up using `Math.ceil` to ensure partial days are counted as full days.
 */
export function differenceInDays(endDate: string, startDate: string): number {
  const upper = new Date(endDate).getTime();
  const lower = new Date(startDate).getTime();
  const diffTime = upper - lower;
  return Math.ceil(diffTime / 86_400_000);
}

/**
 * Gets the current date in the format YYYY-MM-DD.
 *
 * @param timeZone - Optional time zone to use for formatting the date.
 * @param timeZoneName - Optional time zone name to include in the formatted date.
 * @returns The current date as a string in the format YYYY-MM-DD.
 */
export function getCurrentDate(
  timeZone?: Intl.DateTimeFormatOptions["timeZone"],
  timeZoneName?: Intl.DateTimeFormatOptions["timeZoneName"],
): string {
  const [month, date, year] = new Date()
    .toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      timeZone,
      timeZoneName,
      year: "numeric",
    })
    .split("/");

  return `${year}-${month}-${date}`;
}

/**
 * Gets the date part from a string in the format YYYY-MM-DD.
 *
 * @param date - The input date as a string in the format YYYY-MM-DD.
 * @returns The date part as a number.
 */
export function getDate(date: string): number {
  return +date.replace(
    dateRegexp,
    (_: string, _year: string, _month: string, date: string) => date,
  );
}

/**
 * Gets the day of the week from a date string.
 *
 * @param date - The input date as a string in the format YYYY-MM-DD.
 * @returns The day of the week as a number (0-6), where 0 represents Sunday and 6 represents Saturday.
 */
export function getDayOfTheWeek(date: string): number {
  return new Date(date).getUTCDay();
}

/**
 * Gets the first date of the month from a date string.
 *
 * @param date - The input date as a string in the format YYYY-MM-DD.
 * @returns The first date of the month as a string in the format YYYY-MM-DD.
 */
export function getFirstDateOfMonth(date: string): string {
  return date.replace(
    dateRegexp,
    (_: string, year: string, month: string) => `${year}-${month}-01`,
  );
}

/**
 * Gets the last date of the month from a date string.
 *
 * @param date - The input date as a string in the format YYYY-MM-DD.
 * @returns The last date of the month as a string in the format YYYY-MM-DD.
 */
export function getLastDateOfMonth(date: string): string {
  return addDays(addMonths(getFirstDateOfMonth(date), 1), -1);
}

/**
 * Gets the month from a date string.
 *
 * @param date - The input date as a string in the format YYYY-MM-DD.
 * @returns The month as a number (1-12).
 */
export function getMonth(date: string): number {
  return +date.replace(
    dateRegexp,
    (_: string, _year: string, month: string, _date: string) => month,
  );
}

/**
 * Gets the year from a date string.
 *
 * @param date - The input date as a string in the format YYYY-MM-DD.
 * @returns The year as a number.
 */
export function getYear(date: string): number {
  return +date.replace(
    dateRegexp,
    (_: string, year: string, _month: string, _date: string) => year,
  );
}

function isLeap(year: number): boolean {
  return !(year % 4 || (!(year % 100) && year % 400));
}

/**
 * Returns the maximum date from a list of dates.
 *
 * @param date - The first date as a string in the format YYYY-MM-DD.
 * @param dates - Additional dates as strings in the format YYYY-MM-DD.
 * @returns The maximum date as a string in the format YYYY-MM-DD.
 */
export function max(date: string, ...dates: string[]): string {
  let result = date;
  for (const aux of dates) if (aux > result) result = aux;
  return result;
}

/**
 * Returns the minimum date from a list of dates.
 *
 * @param date - The first date as a string in the format YYYY-MM-DD.
 * @param dates - Additional dates as strings in the format YYYY-MM-DD.
 * @returns The minimum date as a string in the format YYYY-MM-DD.
 */
export function min(date: string, ...dates: string[]): string {
  let result = date;
  for (const aux of dates) if (aux < result) result = aux;
  return result;
}

/**
 * Converts a date string to a formatted date string based on the provided locale and options.
 *
 * @param date - The input date as a string in a format compatible with the `Date` constructor.
 * @param locale - Optional locale for formatting the date. Defaults to the system's locale.
 * @param options - Optional formatting options for the date.
 * @returns The formatted date string.
 */
export function toDateString(
  date: string,
  locale?: string,
  options?: Omit<
    Intl.DateTimeFormatOptions,
    | "hour"
    | "hour12"
    | "hourCycle"
    | "minute"
    | "second"
    | "timeZone"
    | "timeZoneName"
  >,
): string {
  return new Date(date).toLocaleDateString(locale, {
    ...options,
    timeZone: "UTC",
  });
}

/**
 * Converts a date to a string in the format YYYY-MM-DD.
 *
 * @param date - The input date as a number (timestamp).
 * @returns The formatted date string in the format YYYY-MM-DD.
 */
export function toString(date: number): string;

/**
 * Converts a date to a string in the format YYYY-MM-DD.
 *
 * @param date - The input date as a Date object.
 * @returns The formatted date string in the format YYYY-MM-DD.
 */
export function toString(date: Date): string;

export function toString(date: Date | number): string {
  date = typeof date === "number" ? new Date(date) : date;
  return `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, "0")}-${date.getUTCDate().toString().padStart(2, "0")}`;
}

/**
 * Validates if a given date string is in the format YYYY-MM-DD and represents a valid date.
 *
 * @param date - The input date as a string in the format YYYY-MM-DD.
 * @returns `true` if the date is valid, `false` otherwise.
 */
export function validate(date: string): boolean {
  const matches = dateRegexp.exec(date);
  if (!matches) return false;

  const year = +matches[1];
  const month = +matches[2];
  const day = +matches[3];

  if (day <= 0) return false;
  if (month <= 0 || month > 12) return false;
  if (month === 2 && isLeap(year)) return day <= 29;
  return day <= maxDaysPerMonth[month - 1];
}
