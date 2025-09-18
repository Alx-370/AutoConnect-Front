export type MakeName  = string;
export type ModelName = string;
export type YearValue = number;

export type MakeDto  = { id: number; name: string };
export type ModelDto = { id: number; name: string };
export type YearDto  = { years: number };

export type CarSelection = {
    make: MakeName | null;
    model: ModelName | null;
    year: YearValue | null;
};

export type CarSearchProps = {
    onChangeCar?: (sel: CarSelection) => void;
    immat: string;
    km: string;
    onChangeImmat: (v: string) => void;
    onChangeKm: (v: string) => void;
};
/*
export type CarDetailProps = {}
*/

export type CarDetail = {
    immat: string;
    km: string;
    make: string;
    model: string;
    year: number;
}