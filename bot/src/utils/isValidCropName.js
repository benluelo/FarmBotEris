import cropData from "../data/crop-data.js";
export function isValidCropName(crop) {
    return cropData.hasOwnProperty(crop);
}
