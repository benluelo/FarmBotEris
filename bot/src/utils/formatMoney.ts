import emoji from '../json/emoji.json';

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
});

/**
 * @description Formats money for sending to the user. Appends the coin emoji to the end.
 * @param value - The amount you want to format as money.
 * @returns - The formatted amount.
 */

export function formatMoney(value: number): string {
  return formatter.format(value).substr(1) + ' ' + emoji.coin;
}
