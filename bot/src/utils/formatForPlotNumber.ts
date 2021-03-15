import { ABCDE, _12345, _01234 } from "./utils";

/**
 * @description Formats the individual `letter` and `number` portions of the plot number.
 * @param str - The `number` or `letter` to format for the plot.
 * @returns The index of the plot.
 */

export function formatForPlotNumber(str: (ABCDE | _12345)): _01234 {
  switch (str) {
    case ("1"):
    case ("a"): return "0";
    case ("2"):
    case ("b"): return "1";
    case ("3"):
    case ("c"): return "2";
    case ("4"):
    case ("d"): return "3";
    case ("5"):
    case ("e"): return "4";
  }
  throw new Error("unformattable plot number: " + str);
}
