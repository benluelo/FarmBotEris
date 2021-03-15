import cropData from '../data/crop-data.js';
import type { CropName } from '../dtos/Crop';

export function isValidCropName(crop: string): crop is CropName {
  return cropData.hasOwnProperty(crop);
}
