import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import PrestationItem from "./PrestationItem";
import type { PrestationItem as Prestation } from "../types/prestationItem";
import { fetchServices } from "../api/services";

const PrestationListContainer = () => {
    const [items, setItems] = useState<Prestation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedIds, setSelectedIds] = useState<Set<number | string>>(new Set());

    useEffect(() => {
        fetchServices()
            .then(setItems)
            .catch((e: unknown) =>
                setError(e instanceof Error ? e.message : "Erreur inconnue")
            )
            .finally(() => setLoading(false));
    }, []);

    const toggle = (p: Prestation) => {
        const id = p.id;
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    if (loading) return <p style={{ textAlign: "center" }}>Chargement…</p>;
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
                {items.map(p => (
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
