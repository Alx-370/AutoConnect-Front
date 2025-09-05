import { Stack, Typography} from "@mui/material";
import type {Geoloc} from "../types/geoloc.ts";


interface CardGeolocGarageProps {
    geoloc: Geoloc;
}

const CardGeolocGarage = ({geoloc}: CardGeolocGarageProps) => {
    return (
        <Stack alignItems="flex-start" spacing={0.5}>
            <Typography variant="subtitle1">{geoloc.name}</Typography>
            <Typography variant="body2" color="text.secondary">
                {geoloc.numeroVoie}, {geoloc.typeVoie}, {geoloc.codePostal} {geoloc.libelleCommune}
            </Typography>
        </Stack>
    );
};
export default CardGeolocGarage;
