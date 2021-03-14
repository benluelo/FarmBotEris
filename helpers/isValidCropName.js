import cropData from "../bot/lib/crop-data.js";
export function isValidCropName(crop) {
    return cropData.hasOwnProperty(crop);
}
