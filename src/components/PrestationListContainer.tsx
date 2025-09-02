import { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import PrestationItem from "./PrestationItem";
import type { PrestationItem as Prestation } from "../types/prestationItem";

const PrestationListContainer = () => {
    const [items, setItems] = useState<Prestation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        axios
            .get<Prestation[]>("http://localhost:8080/services")
            .then(res =>  {
                console.log("[/services] data:", res.data);
                setItems(res.data);
            } )
            .catch(err => setError(err?.message ?? "Erreur inconnue"))
            .finally(() => setLoading(false));


    }, []);

    if (loading) return <p style={{ textAlign: "center" }}>Chargement…</p>;
    if (error) return <p style={{ textAlign: "center", color: "crimson" }}>Erreur : {error}</p>;

    return (
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
                <PrestationItem key={p.id} prestation={p} />
            ))}
        </Box>
    );
};

export default PrestationListContainer;
