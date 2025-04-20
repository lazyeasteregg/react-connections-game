import {
  addDays,
  addMinutes,
  differenceInDays,
  formatISO,
  parseISO,
  startOfDay,
  startOfToday,
  startOfYesterday,
} from "date-fns";

import queryString from "query-string";

import { CONNECTION_GAMES } from "./data";

export const getToday = () => startOfToday();
export const getYesterday = () => startOfYesterday();

// October 2023 Game Epoch
// https://stackoverflow.com/questions/2552483/why-does-the-month-argument-range-from-0-to-11-in-javascripts-date-constructor
export const firstGameDate = new Date(2025, 3, 18, 10, 30, 15);
export const periodInDays = 1;
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

export const getLastGameDate = (today) => {
  const t = startOfDay(today);
  let daysSinceLastGame = differenceInDays(t, firstGameDate) % periodInDays;
  return addDays(t, -daysSinceLastGame);
};

//export const getNextGameDate = (currentDate = new Date()) => {
 // return addDays(getLastGameDate(today), periodInDays);
//  return addMinutes(currentDate, 2);
// };

export const isValidGameDate = (date) => {
  if (date < firstGameDate || date > getToday()) {
    return false;
  }

  return differenceInDays(firstGameDate, date) % periodInDays === 0;
};

export const getIndex = (gameDate) => {
  let start = firstGameDate;
  let index = -1;
  console.log(firstGameDate);
  do {
    index++;
    start = addDays(start, periodInDays);
  } while (start <= gameDate);

  return index;
};

export const getPuzzleOfDay = (index) => {
  if (index < 0) {
    throw new Error("Invalid index");
  }

  return CONNECTION_GAMES[index % CONNECTION_GAMES.length];
};

export const getSolution = (gameDate) => {
  const nextGameDate = getNextGameDate(gameDate);
  //const getNextGameDate = (currentDate = new Date()) => {
    // Add a cache buster to the URL.
   // const nextGameDate = addDays(startOfDay(currentDate), 1);
   // const cacheBuster = `?cb=${Date.now()}`;  // Use current timestamp as cache buster.
   // return new Date(nextGameDate.getTime() + cacheBuster); //error:  An argument of type 'string | number' is not assignable to parameter of type 'number'.
//};
  const index = getIndex(gameDate);
  const puzzleOfTheDay = getPuzzleOfDay(index);
  console.log("index for today: ", index);
  return {
    puzzleAnswers: puzzleOfTheDay,
    puzzleGameDate: gameDate,
    puzzleIndex: index,
    dateOfNextPuzzle: nextGameDate.valueOf(),
  };
};

export const getGameDate = () => {
  if (getIsLatestGame()) {
    return getToday();
  }

  const parsed = queryString.parse(window.location.search);
  try {
    const d = startOfDay(parseISO(parsed.d?.toString()));
    if (d >= getToday() || d < firstGameDate) {
      setGameDate(getToday());
    }
    return d;
  } catch (e) {
    console.log(e);
    return getToday();
  }
};

export const setGameDate = (d) => {
  try {
    if (d < getToday()) {
      window.location.href = "/?d=" + formatISO(d, { representation: "date" });
      return;
    }
  } catch (e) {
    console.log(e);
  }
  window.location.href = "/";
};

export const getIsLatestGame = () => {
  // https://github.com/cwackerfuss/react-wordle/pull/505
  const parsed = queryString.parse(window.location.search);
  return parsed === null || !("d" in parsed);
};

export const { puzzleAnswers, puzzleGameDate, puzzleIndex, dateOfNextPuzzle } =
  getSolution(getGameDate());
