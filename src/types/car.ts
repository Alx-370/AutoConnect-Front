export type MakeName  = string;
export type ModelName = string;
export type YearValue = number;


export type MakeDto  = {
    id: number;
    name: string
};

export type ModelDto = {
    id: number;
    name: string
};
export type YearDto  = {
    years: number
};

export type CarSelection = {
    make: MakeName | null;
    model: ModelName | null;
    year: YearValue | null;
};

export type CarSearchProps = {
    onChangeCar?: (sel: CarSelection) => void;
};

