import { useEffect, useState } from "react";
import {Accordion, AccordionSummary, AccordionDetails, Autocomplete, TextField, Box, Stack, Typography, Chip, Button,} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import { fetchMakes, fetchModels, fetchYears } from "../api/axiosCar";
import type {MakeDto, ModelDto, YearDto, MakeName, ModelName, YearValue, CarSearchProps} from "../types/car";

const GRADIENT = "linear-gradient(90deg,#1976d2,#2196f3)";

const CarSearch = ({ onChangeCar, immat, km, onChangeImmat, onChangeKm }: CarSearchProps) => {
    const [makes, setMakes]   = useState<MakeDto[]>([]);
    const [models, setModels] = useState<ModelDto[]>([]);
    const [years, setYears]   = useState<YearDto[]>([]);

    const [make, setMake]   = useState<MakeName | null>(null);
    const [model, setModel] = useState<ModelName | null>(null);
    const [year, setYear]   = useState<YearValue | null>(null);

    const [expanded, setExpanded] = useState<boolean>(true);

    // Marques
    useEffect(() => {
        fetchMakes().then(setMakes).catch(console.error);
    }, []);

    // Modèles quand la marque change
    useEffect(() => {
        setModels([]); setYears([]); setModel(null); setYear(null);
        if (!make) return;
        fetchModels(make).then(setModels).catch(console.error);
    }, [make]);

    // Années quand le modèle change
    useEffect(() => {
        setYears([]); setYear(null);
        if (!make || !model) return;
        fetchYears(make, model).then(setYears).catch(console.error);
    }, [make, model]);

    // Remonter la sélection au parent (localStorage côté Dashboard)
    useEffect(() => {
        onChangeCar?.({ make, model, year });
    }, [make, model, year, onChangeCar]);

    const makeOptions: MakeName[]   = makes.map(m => m.name);
    const modelOptions: ModelName[] = models.map(m => m.name);
    const yearOptions: YearValue[]  = years.map(y => y.years);

    // Chips de résumé dans l’entête
    const chips: string[] = [
        immat ? `Immat: ${immat}` : "",
        km ? `Km: ${km}` : "",
        make ?? "",
        model ?? "",
        year !== null && year !== undefined ? String(year) : "",
    ].filter(Boolean);

    const handleReset = () => {
        setMake(null); setModel(null); setYear(null);
        onChangeCar?.({ make: null, model: null, year: null });
        onChangeImmat?.("");
        onChangeKm?.("");
    };

    return (
        <>
            <Typography
                variant="h5"
                sx={{ fontWeight: 700, padding: 6, mt: 1, display: "flex", justifyContent: "center" }}
            >
                Entrez informations véhicule
            </Typography>

            <Accordion
                expanded={expanded}
                onChange={(_, v) => setExpanded(v)}
                elevation={0}
                sx={{
                    maxWidth: 1150,
                    mx: "auto",
                    borderRadius: 3,
                    overflow: "hidden",
                    border: (t) => `1px solid ${t.palette.divider}`,
                    bgcolor: "background.paper",
                    boxShadow: "0 10px 28px rgba(0,0,0,.06)",
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
                    sx={{
                        background: GRADIENT,
                        color: "white",
                        "& .MuiAccordionSummary-content": { my: 1, display: "block" },
                    }}
                >
                    <Stack spacing={1}>
                        <Stack direction="row" spacing={1} display={"flex"} flexDirection={"column"} alignItems="center">
                            <DirectionsCarFilledIcon />
                            <Typography variant="h6" fontWeight={700}>
                                Infos véhicule
                            </Typography>
                            <Typography
                                variant="caption"
                                sx={{
                                    ml: 1,
                                    px: 1,
                                    py: 0.25,
                                    borderRadius: 1,
                                    bgcolor: "rgba(255,255,255,.18)",
                                }}
                            >
                                {chips.length > 0 ? "Résumé rempli" : "Aucune info"}
                            </Typography>
                        </Stack>

                        {chips.length > 0 && (
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                {chips.slice(0, 4).map((c) => (
                                    <Chip
                                        key={c}
                                        size="small"
                                        label={c}
                                        variant="outlined"
                                        sx={{
                                            bgcolor: "rgba(255,255,255,.16)",
                                            color: "white",
                                            borderColor: "rgba(255,255,255,.4)",
                                        }}
                                    />
                                ))}
                                {chips.length > 4 && (
                                    <Chip
                                        size="small"
                                        label={`+${chips.length - 4}`}
                                        variant="outlined"
                                        sx={{
                                            bgcolor: "rgba(255,255,255,.16)",
                                            color: "white",
                                            borderColor: "rgba(255,255,255,.4)",
                                        }}
                                    />
                                )}
                            </Box>
                        )}
                    </Stack>
                </AccordionSummary>

                <AccordionDetails
                    sx={{
                        p: { xs: 1.5, sm: 2.5 },
                        bgcolor: "rgba(172,172,172,.06)",
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
                                onChange={(e) => onChangeImmat?.(e.target.value)}
                            />
                            <TextField
                                sx={{ width: 180 }}
                                label="Kilométrage"
                                variant="outlined"
                                value={km}
                                onChange={(e) => onChangeKm?.(e.target.value)}
                            />
                        </Stack>
                    </Stack>

                    <Box display="flex" gap={2} flexWrap="wrap" mt={4} justifyContent="center">
                        <Autocomplete<MakeName>
                            options={makeOptions}
                            value={make}
                            onChange={(_, v) => setMake(v)}
                            sx={{ width: 250 }}
                            renderInput={(p) => <TextField {...p} label="Marque" />}
                        />
                        <Autocomplete<ModelName>
                            options={modelOptions}
                            value={model}
                            onChange={(_, v) => setModel(v)}
                            sx={{ width: 250 }}
                            disabled={!make}
                            renderInput={(p) => <TextField {...p} label="Modèle" />}
                        />
                        <Autocomplete<YearValue>
                            options={yearOptions}
                            value={year}
                            onChange={(_, v) => setYear(v)}
                            getOptionLabel={(o) => String(o)}
                            sx={{ width: 200 }}
                            disabled={!model}
                            renderInput={(p) => <TextField {...p} label="Année" />}
                        />
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                        <Button size="small" variant="text" onClick={handleReset} sx={{ textTransform: "none" }}>
                            Réinitialiser
                        </Button>
                    </Box>
                </AccordionDetails>
            </Accordion>
        </>
    );
};

export default CarSearch;
