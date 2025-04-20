import { addDays, format } from 'date-fns';

const DAILY_PUZZLE_EPOCH = 1696838400000; // Tuesday, October 10, 2023 00:00:00

/**
 * Calculates the puzzle number based on the given date and query parameter.
 * @param {Date} date - The date for which to calculate the puzzle number.
 * @param {string} queryParam - The query parameter string (e.g., "?p=1").
 * @returns {number} The puzzle number.
 */
export const getPuzzleNumber = (date = new Date(), queryParam = "") => {
  let puzzleNumber = Math.floor((date.getTime() - DAILY_PUZZLE_EPOCH) / (1000 * 60 * 60 * 24));

  if (queryParam) {
    const pValue = new URLSearchParams(queryParam).get("p");
    if (pValue) {
      const parsedPValue = parseInt(pValue, 10);
      if (!isNaN(parsedPValue) && parsedPValue > 0) {
        puzzleNumber = parsedPValue - 1; // Adjust to be 0-indexed
      }
    }
  }
  return puzzleNumber;
};

/**
 * Calculates the start time for the puzzle based on the puzzle number.
 * @param {number} puzzleNumber - The puzzle number.
 * @returns {Date} The start time of the puzzle.
 */
export const getPuzzleStartTime = (puzzleNumber) => {
  return addDays(new Date(DAILY_PUZZLE_EPOCH), puzzleNumber);
};

/**
 * Formats the given date into a string representation.
 * @param {Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
export const getFormattedDate = (date = new Date()) => {
  return format(date, 'yyyy-MM-dd');
};

/**
  * Calculates the date and time of the next puzzle.
  * @param {Date} currentDate - The current date.
  * @returns {Date} The date and time of the next puzzle.
  */
export const getNextGameDate = (currentDate = new Date()) => {
    return addDays(startOfDay(currentDate), 1);
};
