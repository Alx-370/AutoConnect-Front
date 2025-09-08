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
                {isOpen && (
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{mt: 2}}
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/search-appointment-garage`);
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
