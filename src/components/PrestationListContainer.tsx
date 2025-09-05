import { useEffect, useState } from "react";
import {Box, Button} from "@mui/material";
import PrestationItem from "./PrestationItem";
import type { PrestationItem as Prestation } from "../types/prestationItem";
import { fetchServices } from "../api/axiosServices";
import type { PrestationListContainerProps as Props } from "../types/propsPrestationItem";



const PrestationListContainer = ({ selectedIds, onToggleId }: Props) => {
    const [items, setItems] = useState<Prestation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchServices()
            .then((data) => {
                console.log("Services reçus :", data);
                setItems(data);
            })
            .catch((e: unknown) =>
                setError(e instanceof Error ? e.message : "Erreur inconnue")
            )
            .finally(() => setLoading(false));
    }, []);

    const toggle = (p: Prestation) => onToggleId(p.id);


    if (loading) return <Box style={{textAlign: "center"}}><Button loading loadingIndicator="Loading…"
                                                                   variant="outlined">
        Fetch data
    </Button></Box>;
    if (error) return <p style={{ textAlign: "center", color: "crimson" }}>Erreur : {error}</p>;


    return (
        <>
            <h2 style={{ padding: 16, marginTop: 40, display: "flex", justifyContent: "center" }}>
                Choisir prestations
            </h2>

            <Box
                sx={{
                    mt: 3,
                    px: 2,
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
        </>
    );
};

export default PrestationListContainer;
