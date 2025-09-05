import {useEffect, useState} from "react";
import type {PrestationItem as Prestation} from "../types/prestationItem.ts";

import {Box, Button} from "@mui/material";

import CardGeolocGarage from "./CardGeolocGarage.tsx";
import type {Geoloc} from "../types/geoloc.ts";
import {axiosGeoloc} from "../api/axiosGeoloc.ts";

const GelocList = () => {
    const [items, setItems] = useState<Geoloc[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [coordinate, setCoordinate] = useState<string>("");
    const [radiusKm, setRadiusKm] = useState<number>(10);
    const [services, setServices] = useState<Prestation[]>([]);




    useEffect(() => {
       axiosGeoloc(services, coordinate, radiusKm)
            .then((data) => {
                console.log("Services reçus :", data);
                setItems(data);
            })
            .catch((e: unknown) =>
                setError(e instanceof Error ? e.message : "Erreur inconnue")
            )
            .finally(() => setLoading(false));
    }, []);



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
                {items.map(garage => (
                    <CardGeolocGarage key={garage.id} geoloc={garage}/>
                ))}


            </Box>
        </>
    );
};

export default GelocList;