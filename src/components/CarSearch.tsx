import { useEffect, useState } from "react";
import { Autocomplete, TextField, Box } from "@mui/material";
import { fetchMakes, fetchModels, fetchYears } from "../api/axiosCar.ts";
import type { MakeDto, ModelDto, YearDto, MakeName, ModelName, YearValue } from "../types/car";

const CarSearch = () => {
    const [makes, setMakes] = useState<MakeDto[]>([]);
    const [models, setModels] = useState<ModelDto[]>([]);
    const [years, setYears] = useState<YearDto[]>([]);

    const [make, setMake] = useState<MakeName | null>(null);
    const [model, setModel] = useState<ModelName | null>(null);
    const [year, setYear] = useState<YearValue | null>(null);

    //////////////////////////////// marques ////////////////////////////////
    useEffect(() => {
        fetchMakes().then(setMakes).catch(console.error);
    }, []);

    ////////////////////////// modèles quand la marque change /////////////////
    useEffect(() => {
        setModels([]); setYears([]); setModel(null); setYear(null);
        if (!make) return;
        fetchModels(make).then(setModels).catch(console.error);
    }, [make]);

    ///////////////////// années quand le modèle change //////////////////////////
    useEffect(() => {
        setYears([]); setYear(null);
        if (!make || !model) return;
        fetchYears(make, model).then(setYears).catch(console.error);
    }, [make, model]);


    const makeOptions: MakeName[]   = makes.map(m => m.name);
    const modelOptions: ModelName[] = models.map(m => m.name);
    const yearOptions: YearValue[]  = years.map(y => y.years);

    return (
        <Box display="flex" gap={2} flexWrap="wrap" mt={4} justifyContent="center">
            <Autocomplete
                options={makeOptions}
                value={make}
                onChange={(_, v) => setMake(v)}
                sx={{ width: 250 }}
                renderInput={(p) => <TextField {...p} label="Marque" />}
            />
            <Autocomplete
                options={modelOptions}
                value={model}
                onChange={(_, v) => setModel(v)}
                sx={{ width: 250 }}
                disabled={!make}
                renderInput={(p) => <TextField {...p} label="Modèle" />}
            />
            <Autocomplete
                options={yearOptions}
                value={year}
                onChange={(_, v) => setYear(v)}
                getOptionLabel={(o) => String(o)}
                sx={{ width: 200 }}
                disabled={!model}
                renderInput={(p) => <TextField {...p} label="Année" />}
            />
        </Box>
    );
};

export default CarSearch;
