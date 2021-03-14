import cropData from "../bot/lib/crop-data.js"
import { CropName } from "../bot/dtos/Crop.js"

export function isValidCropName(crop: string): crop is CropName {
  return cropData.hasOwnProperty(crop)
}
