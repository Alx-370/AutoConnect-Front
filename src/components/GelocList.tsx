import {useEffect, useState} from "react";


import {Box, Button} from "@mui/material";

import CardGeolocGarage from "./CardGeolocGarage.tsx";
import type {Geoloc} from "../types/geoloc.ts";
import {axiosGeoloc} from "../api/axiosGeoloc.ts";

type GelocListProps = {
    searchQuery: string;
    radiusKm : number;
};
const GelocList = ({searchQuery, radiusKm}: GelocListProps) => {
    const [items, setItems] = useState<Geoloc[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [services, setServices] = useState<number[]>([]);


    useEffect(() => {
        const saved = localStorage.getItem("ac.selection");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.services) {
                    setServices(parsed.services);
                }
            } catch (e) {
                console.error("Impossible de parser le localStorage", e);
            }
        }
    }, []);

    useEffect(() => {
       axiosGeoloc(services, searchQuery, radiusKm)
            .then((data) => {
                console.log("Services reçus :", data);
                setItems(data);
            })
            .catch((e: unknown) =>
                setError(e instanceof Error ? e.message : "Erreur inconnue")
            )
            .finally(() => setLoading(false));
    }, [searchQuery]);



    if (loading) return <Box style={{textAlign: "center"}}><Button loading loadingIndicator="Loading…"
                                                                   variant="outlined">
        Fetch data
    </Button></Box>;
    if (error) return <p style={{textAlign: "center", color: "crimson"}}>Erreur : {error}</p>;

    return (
        <>

            <Box
                sx={{
                    mt: 3,
                    px: 2,
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                }}
            >
                {items.map(garage => {
                    console.log(garage); // log ici
                    return <CardGeolocGarage key={garage.id} geoloc={garage}/>;
                })}

            </Box>
        </>
    );
};

export default GelocList;