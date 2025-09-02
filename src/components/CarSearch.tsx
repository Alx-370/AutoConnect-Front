import { useEffect, useState } from "react";
import { Autocomplete, TextField, Box } from "@mui/material";
import axios from "axios";

type MakeDto = {
    id: number,
    name: string;
}

const API_BASE = "https://carapi.app";

const CarSearch = () => {
    const [makes, setMakes] = useState<MakeDto[]>([]);
    const [models, setModels] = useState<string[]>([]);
    const [years, setYears] = useState<number[]>([]);

    const [make, setMake] = useState<string | null>(null);
    const [model, setModel] = useState<string | null>(null);
    const [year, setYear] = useState<number | null>(null);

    useEffect(() => {
        axios
            .get<MakeDto[]>(`http://localhost:8080/car-api/makes`)
            .then((res) => {
                setMakes(res.data);
                console.log(res.data)
            })
            .catch(console.error);
    }, []);


    useEffect(() => {
        setModels([]);
        setYears([]);
        setModel(null);
        setYear(null);

        if (!make) return;

        axios
            .get<string[]>(`${API_BASE}/api/models`, { params: { make } })
            .then((res) => setModels(res.data))
            .catch(console.error);
    }, [make]);


    useEffect(() => {
        setYears([]);
        setYear(null);

        if (!make || !model) return;

        axios
            .get<number[]>(`${API_BASE}/api/years`, { params: { make, model } })
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
                options={models}
                value={model}
                onChange={(_, newValue) => setModel(newValue)}
                sx={{ width: 250 }}
                disabled={!make}
                renderInput={(params) => <TextField {...params} label="Modèle" />}
            />


            <Autocomplete
                options={years}
                value={year}
                onChange={(_, newValue) => setYear(newValue)}
                sx={{ width: 200 }}
                disabled={!model}
                renderInput={(params) => <TextField {...params} label="Année" />}
            />
        </Box>
    );
};

export default CarSearch;
