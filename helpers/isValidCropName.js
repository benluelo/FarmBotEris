import cropData from "../bot/lib/crop-data";
export function isValidCropName(crop) {
    return cropData.hasOwnProperty(crop);
}
