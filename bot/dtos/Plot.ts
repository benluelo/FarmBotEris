import { CropName } from "./Crop";


export type Plot = {
    crop: {
        /** The crop currently planted on the plot. */
        planted: CropName | "dirt";
        /** The time that the crop was planted at. */
        datePlantedAt: number;
    };
    /** Whether or not the plot is fertilized. **Not yet implemented**! */
    fertilized: boolean;
    /** Whether or not the plot is watered. **Not yet implemented**! */
    watered: boolean;
};
