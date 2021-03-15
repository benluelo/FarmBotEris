
export const plotRegex = /^[a-e]{1}[1-5]{1}$/;

export type ABCDE = ('a' | 'b' | 'c' | 'd' | 'e');

export type _12345 = ('1' | '2' | '3' | '4' | '5');

export type _01234 = ('0' | '1' | '2' | '3' | '4');

export const genders = ['male', 'female'] as const;

export function randomIndex(array: unknown[]): number {
  return Math.floor(Math.random() * array.length);
}

export function capitalize(str: string): string {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}
