import {Card, CardContent, Typography, Avatar, Button} from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";

import type {Geoloc} from "../types/geoloc";
import {useState} from "react";
import {useNavigate} from "react-router";
import type {QuoteLS} from "../types/quote.ts";

interface CardGeolocGarageProps {
    geoloc: Geoloc;
    onResult?: (coords: [number, number]) => void;
    isOpen: boolean;
    onSelect: (id: number) => void;
}

const CardGeolocGarage = ({geoloc, onResult, isOpen, onSelect}: CardGeolocGarageProps) => {

    const navigate = useNavigate();
    const handleCardClick = () => {
        onResult?.([geoloc.latitude, geoloc.longitude]);
        onSelect(geoloc.id);
    };


    const readLS = (): QuoteLS => {
        const raw = localStorage.getItem("ac.selection");
        if (!raw) return {};
        try {
            const parsed = JSON.parse(raw) as QuoteLS;
            const year = parsed.year

            const services = parsed.services
            return {
                immat: parsed.immat ?? undefined,
                km: parsed.km ?? undefined,
                make: parsed.make ?? null,
                model: parsed.model ?? null,
                year,
                services,
            };
        } catch {
            return {};
        }
    };
    const [data] = useState<QuoteLS>(() => readLS());

    const handleSave = () => {

        console.log("handleSave appelé");

        const newGarage = {
            ...data,
            id: geoloc.id,
            name: geoloc.name,
            typeVoie: geoloc.typeVoie,
            libelleVoie: geoloc.libelleVoie,
            codePostal: geoloc.codePostal,
            libelleCommune: geoloc.libelleCommune,
            phone: geoloc.phone,
        };

        localStorage.setItem("ac.selection", JSON.stringify(newGarage));
        navigate(`/search-appointment-garage`);
    };

    return (
        <Card
            sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                borderRadius: 2,
                boxShadow: 2,
                minWidth: 280,
                m:2,

            }}
            onClick={handleCardClick}

        >

            <Avatar sx={{bgcolor: "primary.main", mr: 2}}>
                <StoreIcon/>
            </Avatar>

            <CardContent sx={{p: 0}}>

                <Typography variant="subtitle1" fontWeight="bold">
                    {geoloc.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    {geoloc.typeVoie} {geoloc.libelleVoie}, {geoloc.codePostal}{" "}
                    {geoloc.libelleCommune}
                </Typography>
                <Typography> {geoloc.phone}</Typography>
                {isOpen && (
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{mt: 2}}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSave();
                        }}
                    >
                        Prendre rendez-vous
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default CardGeolocGarage;
