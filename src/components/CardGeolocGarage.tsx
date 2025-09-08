import {Card, CardContent, Typography, Box, Avatar} from "@mui/material";
import StoreIcon from "@mui/icons-material/Store"; // l'icône boutique

import type {Geoloc} from "../types/geoloc";

interface CardGeolocGarageProps {
    geoloc: Geoloc;
}

const CardGeolocGarage = ({geoloc}: CardGeolocGarageProps) => {
    return (
        <Card
            sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                borderRadius: 2,
                boxShadow: 2,
                minWidth: 280,
            }}
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
            </CardContent>
        </Card>
    );
};

export default CardGeolocGarage;
