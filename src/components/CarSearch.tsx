import { useEffect, useState } from "react";
import { Autocomplete, TextField, Box, Stack, Typography } from "@mui/material";
import { fetchMakes, fetchModels, fetchYears } from "../api/axiosCar";
import type {
    MakeDto, ModelDto, YearDto,
    MakeName, ModelName, YearValue,
    CarSearchProps
} from "../types/car";

const CarSearch = ({ onChangeCar, immat, km, onChangeImmat, onChangeKm }: CarSearchProps) => {
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

    ///////////////////// récup info pour localStorage ///////////////////////////
    useEffect(() => {
        onChangeCar?.({ make, model, year });
    }, [make, model, year, onChangeCar]);

    const makeOptions: MakeName[]   = makes.map(m => m.name);
    const modelOptions: ModelName[] = models.map(m => m.name);
    const yearOptions: YearValue[]  = years.map(y => y.years);

    return (
        <>
            <Typography variant="h5" sx={{ fontWeight: 700,padding: 6, marginTop: 1, display: "flex", justifyContent: "center" }}>
                Entrez informations véhicule
            </Typography>

            <Box
                sx={{
                    maxWidth: 1150,
                    p: { xs: 1.5, sm: 2.5 },
                    borderRadius: 3,
                    bgcolor: "rgba(172,172,172,.06)",
                    border: (t) => `1px solid ${t.palette.divider}`,
                    boxShadow: "0 10px 28px rgba(0,0,0,.06)",
                    backdropFilter: "saturate(1.1) blur(2px)",
                    mx: "auto",
                }}
            >
                <Stack spacing={2} alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Vos informations principales
                    </Typography>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={2}
                        justifyContent="center"
                        alignItems="center"
                        sx={{ mt: 1 }}
                    >
                        <TextField
                            sx={{ width: 180 }}
                            label="Immatriculation"
                            variant="outlined"
                            value={immat}
                            onChange={(e) => onChangeImmat(e.target.value)}
                        />
                        <TextField
                            sx={{ width: 180 }}
                            label="Kilométrage"
                            variant="outlined"
                            value={km}
                            onChange={(e) => onChangeKm(e.target.value)}
                        />
                    </Stack>
                </Stack>

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
            </Box>
        </>
    );
};

export default CarSearch;
