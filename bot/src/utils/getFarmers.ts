import { Npc } from '../lib/Npc.js';
import { transliterate as tr } from 'transliteration';
import cropData from '../data/crop-data.js';
import { Farmer } from '../dtos/Farmer.js';
import { CropName } from '../dtos/Crop.js';
import { getNames } from './getNames.js';

/**
 * Creates 12 (actually 11 for some reason) random farmers for the given region. If the region name is invalid, returns `undefined`.
 */

export function getFarmers(region: string): Farmer[] | undefined {
  const nameSurnameAndGenderArray = getNames(region);
  if (nameSurnameAndGenderArray === undefined) {
    return undefined;
  }
  // why do i filter out apples? i don't remember
  // there are to be 11 villagers, maybe thats why i remove it?
  // shoulda documented this better lol
  const fruitsArray = (Object.keys(cropData) as CropName[])
    .filter(name => 'apple' !== name);
  return [...new Array(11)]
    .map(() => Math.random())
    .sort()
    .map((num, i) => new Npc(
      tr(nameSurnameAndGenderArray[i].name + ' ' + nameSurnameAndGenderArray[i].surname),
      nameSurnameAndGenderArray[i].gender,
      fruitsArray[i],
      num
    ));
}
