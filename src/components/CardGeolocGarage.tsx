import {Stack, Typography} from "@mui/material";
import type {Geoloc} from "../types/geoloc";

interface CardGeolocGarageProps {
    geoloc: Geoloc;
}

const CardGeolocGarage = ({geoloc}: CardGeolocGarageProps) => {
    console.log("geoloc reçu dans la card :", geoloc);

    return (
        <Stack alignItems="flex-start" spacing={0.5}>
            <Typography variant="subtitle1">{geoloc.name}</Typography>
            <Typography variant="body2" color="text.secondary">
                {JSON.stringify(geoloc)}
            </Typography>
        </Stack>
    );
};

export default CardGeolocGarage;
