import {useEffect, useState} from "react";


import {Box, Button} from "@mui/material";

import CardGeolocGarage from "./CardGeolocGarage.tsx";
import type {Geoloc} from "../types/geoloc.ts";
import {axiosGeoloc} from "../api/axiosGeoloc.ts";

type GelocListProps = {
    searchQuery: string;
    radiusKm : number;
    onResult: (garages: Geoloc[]) => void
    onServices?: (services: number[]) => void
};
const GelocList = ({searchQuery, radiusKm, onResult, onServices}: GelocListProps) => {
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
                    onServices?.(parsed.services);
                }
            } catch (e) {
                console.error("Impossible de parser le localStorage", e);
            }
        }
    }, []);

    useEffect(() => {
        if (!searchQuery) return; // on sort si rien à chercher
        setError(null);


        axiosGeoloc(services, searchQuery, radiusKm)
            .then((data) => onResult(data))
            .catch((e: unknown) =>
                setError(e instanceof Error ? e.message : "Erreur inconnue")
            )

    }, [searchQuery, services, radiusKm, onResult]);



    if (error) return <p style={{textAlign: "center"}}>aucun garage trouver</p>;

    return null;
};

export default GelocList;