import { useEffect, useState } from "react";
import { Autocomplete, TextField, Box } from "@mui/material";
import axios from "axios";

const API_BASE = "http://localhost:8080";


type MakeDto = {
    id: number,
    name: string;
}

type ModelDto = {
    id: number,
    name: string;
}

type YearsDto = {
    years: string;
}

const CarSearch = () => {
    const [makes, setMakes] = useState<MakeDto[]>([]);
    const [models, setModels] = useState<ModelDto[]>([]);
    const [years, setYears] = useState<YearsDto[]>([]);

    const [make, setMake] = useState<string | null>(null);
    const [model, setModel] = useState<string | null>(null);
    const [year, setYear] = useState<string | null>(null);


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    useEffect(() => {
        axios
            .get<MakeDto[]>(`${API_BASE}/api/car/mark`, {
            })
            .then((res) => {
                console.log(res.data);
                setMakes(res.data);
            })
            .catch(console.error);
    }, []);


    useEffect(() => {
        setModels([]);
        setYears([]);
        setModel(null);
        setYear(null);

        if (!make) return;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        axios
            .get<ModelDto[]>(`${API_BASE}/api/car/model`, { params: { make } })
            .then(({ data }) => setModels(data))
            .catch(err => console.error("[/api/car/model]", err?.response?.status, err));
    }, [make]);


    useEffect(() => {
        setYears([]);
        setYear(null);

        if (!make || !model) return;
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        axios
            .get<YearsDto[]>(`${API_BASE}/api/car/year`, { params: { make, model } })
            .then((res) => setYears(res.data))
            .catch(console.error);
    }, [model]);

    return (
        <Box display="flex" gap={2} flexWrap="wrap" mt={4} justifyContent="center">

            <Autocomplete
                options={makes.map(m => m.name)}
                value={make}
                onChange={(_, newValue) => setMake(newValue)}
                sx={{ width: 250 }}
                renderInput={(params) => <TextField {...params} label="Marque" />}
            />

            <Autocomplete
                options={models.map(m => m.name)}
                value={model}
                onChange={(_, newValue) => setModel(newValue)}
                sx={{ width: 250 }}
                disabled={!make}
                renderInput={(params) => <TextField {...params} label="Modèle" />}
            />

            <Autocomplete
                options={years.map(m =>m.years)}
                value={year}
                onChange={(_, newValue) => setYear(newValue)}
                getOptionLabel={(option) => String(option)}
                sx={{ width: 200 }}
                disabled={!model}
                renderInput={(params) => <TextField {...params} label="Année" />}
            />
        </Box>
    );
};

export default CarSearch;
