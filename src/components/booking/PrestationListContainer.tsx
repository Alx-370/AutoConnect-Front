import { useEffect, useState } from "react";
import {Box, Accordion, AccordionSummary, AccordionDetails, Typography, Chip, Stack, Button,} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import PrestationItem from "./PrestationItem.tsx";
import type { PrestationItem as Prestation } from "../../types/prestation-item.ts";
import { fetchServices } from "../../api/axiosServices.ts";
import type { PrestationListContainerProps as Props } from "../../types/props-prestation-item.ts";

const GRADIENT = "linear-gradient(90deg,#1976d2,#2196f3)";

const PrestationListContainer = ({ selectedIds, onToggleId }: Props) => {
    const [items, setItems] = useState<Prestation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<boolean>(false);

    useEffect(() => {
        fetchServices()
            .then((data) => {
                console.log("[fetchServices] payload:", data);
                setItems(data);
            })
            .catch((e: unknown) =>
                setError(e instanceof Error ? e.message : "Erreur inconnue")
            )
            .finally(() => setLoading(false));
    }, []);

    const toggle = (p: Prestation) => onToggleId(p.id);

    if (loading) {
        return (
            <Box sx={{ textAlign: "center", mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                    Chargement…
                </Typography>
            </Box>
        );
    }
    if (error) {
        return (
            <p style={{ textAlign: "center", color: "crimson" }}>Erreur : {error}</p>
        );
    }

    const selectedCount = selectedIds.size;
    const selectedNames = items
        .filter((i) => selectedIds.has(i.id))
        .map((i) => i.name);

    return (
        <>
            <h2
                style={{
                    padding: 16,
                    marginTop: 40,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                Choisir prestations
            </h2>

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
                        "& .MuiAccordionSummary-content": {
                            my: 1,
                            display: "block",
                        },
                    }}
                >
                    <Stack spacing={1}>
                        <Stack direction="row" spacing={1} display={"flex"} flexDirection={"column"} alignItems="center">
                            <BuildCircleIcon />
                            <Typography variant="h6" fontWeight={700}>
                                Prestations
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
                                {selectedCount > 0
                                    ? `${selectedCount} sélectionnée${selectedCount > 1 ? "s" : ""}`
                                    : "Aucune sélection"}
                            </Typography>
                        </Stack>


                        {selectedCount > 0 && (
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                    flexWrap: "wrap",
                                }}
                            >
                                {selectedNames.slice(0, 3).map((name) => (
                                    <Chip
                                        key={name}
                                        size="small"
                                        label={name}
                                        sx={{
                                            bgcolor: "rgba(255,255,255,.16)",
                                            color: "white",
                                            borderColor: "rgba(255,255,255,.4)",
                                        }}
                                        variant="outlined"
                                    />
                                ))}
                                {selectedNames.length > 3 && (
                                    <Chip
                                        size="small"
                                        label={`+${selectedNames.length - 3}`}
                                        sx={{
                                            bgcolor: "rgba(255,255,255,.16)",
                                            color: "white",
                                            borderColor: "rgba(255,255,255,.4)",
                                        }}
                                        variant="outlined"
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
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 2 }}
                    >
                        <Typography variant="subtitle2" color="text.secondary">
                            Sélectionnez une ou plusieurs prestations :
                        </Typography>

                        {selectedCount > 0 && (
                            <Button
                                size="small"
                                variant="text"
                                onClick={() => {
                                    selectedIds.forEach((id) => onToggleId(id));
                                }}
                                sx={{ textTransform: "none" }}
                            >
                                Tout désélectionner
                            </Button>
                        )}
                    </Stack>

                    <Box
                        sx={{
                            px: 1,
                            display: "grid",
                            gap: 2,
                            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                        }}
                    >
                        {items.map((p) => (
                            <PrestationItem
                                key={p.id}
                                prestation={p}
                                selected={selectedIds.has(p.id)}
                                onToggle={toggle}
                            />
                        ))}
                    </Box>
                </AccordionDetails>
            </Accordion>
        </>
    );
};

export default PrestationListContainer;
