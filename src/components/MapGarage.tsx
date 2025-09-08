import {MapContainer, Marker, Popup, TileLayer, useMapEvents} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {Box} from "@mui/material";
import type {Geoloc} from "../types/geoloc";
import {useEffect, useState} from "react";
import {axiosGeolocWithGPS} from "../api/axiosGeoloc.ts";

type MapProps = {
    garages: Geoloc[];
    services?: number[];
    radius?: number;

};

const MapGarage = ({garages, services, radius}: MapProps) => {
    const [newGarage, setNewGarages] = useState<Geoloc[]>([]);
    const [status, setStatus] = useState(false);

    const defaultCenter: [number, number] = [46.7036, 0.8489];


    const center: [number, number] =
        garages.length > 0
            ? [garages[0].latitude, garages[0].longitude]
            : defaultCenter;
    const [mapCenter, setMapCenter] = useState<[number, number]>(center);
    const MapEvents = () => {
        const map = useMapEvents({
            moveend: () => {
                const newCenter = map.getCenter();
                setMapCenter([newCenter.lat, newCenter.lng]);
                console.log("Centre actuel :", newCenter.lat, newCenter.lng);
            },
        });
        return null;

    };
    useEffect(() => {
        axiosGeolocWithGPS(services ?? [], mapCenter[0], mapCenter[1], radius ?? 10)
            .then((data) => setNewGarages(data));
    }, [mapCenter, services, radius]);

    return (
        <Box sx={{display: "flex", width: "100%", height: "75vh", p: 2}}>
            <MapContainer
                center={center}
                zoom={13}
                style={{width: "100%", height: "100%"}}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


                {(newGarage.length > 0 ? newGarage : garages).map((garage) => (
                    <Marker
                        key={garage.id}
                        position={[garage.latitude, garage.longitude]}
                    >
                        <Popup>
                            <strong>{garage.name}</strong> <br/>
                            {garage.typeVoie} {garage.libelleVoie}, {garage.codePostal}{" "}
                            {garage.libelleCommune}
                        </Popup>
                    </Marker>
                ))}

            </MapContainer>
        </Box>
    );
};

export default MapGarage;