import { addMinutes, format, startOfDay } from 'date-fns';

const DAILY_PUZZLE_EPOCH = 1696838400000; // Tuesday, October 10, 2023 00:00:00

/**
 * Calculates the puzzle number based on the given date.
 * @param {Date} date - The date for which to calculate the puzzle number.
 * @returns {number} The puzzle number.
 */
export const getPuzzleNumber = (date: Date = new Date()): number => {
  const diffInMinutes = Math.floor((date.getTime() - DAILY_PUZZLE_EPOCH) / (1000 * 60 * 15));
  return diffInMinutes;
};

/**
 * Calculates the start time for the puzzle based on the puzzle number.
 * @param {number} puzzleNumber - The puzzle number.
 * @returns {Date} The start time of the puzzle.
 */
export const getPuzzleStartTime = (puzzleNumber: number): Date => {
    return addMinutes(new Date(DAILY_PUZZLE_EPOCH), puzzleNumber * 15);
};

/**
 * Formats the given date into a string representation.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
export const getFormattedDate = (date: Date = new Date()): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Gets the end of the day
 * @param {Date} date - the date
 * @returns {Date} the end of the day
 */
export const getEndOfDay = (date: Date = new Date()): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
}
