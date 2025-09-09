import {Card, CardContent, Typography, Box, Avatar, Button} from "@mui/material";
import StoreIcon from "@mui/icons-material/Store"; // l'icône boutique

import type {Geoloc} from "../types/geoloc";
import {useState} from "react";
import {useNavigate} from "react-router";

interface CardGeolocGarageProps {
    geoloc: Geoloc;
    onResult?: (coords: [number, number]) => void;
    isOpen: boolean;
    onSelect: (id: number) => void;
}

const CardGeolocGarage = ({geoloc, onResult, isOpen, onSelect}: CardGeolocGarageProps) => {
    const[show , setShow] = useState(false);
    const navigate = useNavigate();
    const handleCardClick = () => {
        onResult?.([geoloc.latitude, geoloc.longitude]);
        onSelect(geoloc.id); // dit au parent : "c’est moi le sélectionné"
    };


    const handleSave = () => {
        console.log("handleSave appelé");
        const stored = localStorage.getItem("ac.selection");
        let existing = stored ? JSON.parse(stored) : [];

        if (!Array.isArray(existing)) {
            existing = [];
        }

        const newGarage = {
            id: geoloc.id,
            name: geoloc.name,
            typeVoie: geoloc.typeVoie,
            libelleVoie: geoloc.libelleVoie,
            codePostal: geoloc.codePostal,
            libelleCommune: geoloc.libelleCommune,
            phoneNumber: geoloc.phoneNumber,
        };

        const updated = [...existing, newGarage];

        localStorage.setItem("ac.selection", JSON.stringify(updated));

        console.log("saved:", updated);
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
                <Typography> {geoloc.phoneNumber}</Typography>
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
