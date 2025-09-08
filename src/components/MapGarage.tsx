import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {Box} from "@mui/material";
import type {Geoloc} from "../types/geoloc";
import {useEffect, useState} from "react";
import {axiosGeolocWithGPS} from "../api/axiosGeoloc.ts";

type MapProps = {
    garages: Geoloc[];
    services?: number[];
    radius?: number;
    switchCoordinate?: [number, number] | null;
    userPosition?: [number, number] | null;
};


const MapGarage = ({garages, services, radius, switchCoordinate, userPosition }: MapProps) => {
    const [newGarage, setNewGarages] = useState<Geoloc[]>([]);
    const defaultCenter: [number, number] = [48.866667, 2.333333];

    const initialCenter: [number, number] =
        userPosition ??
        (garages.length > 0 ? [garages[0].latitude, garages[0].longitude] : defaultCenter);

    const [mapCenter, setMapCenter] = useState<[number, number]>(initialCenter);

    // RecenterMap utilise d'abord switchCoordinate si défini, sinon userPosition
    const RecenterMap = () => {
        const map = useMap();
        useEffect(() => {
            const coord = switchCoordinate ?? userPosition ?? null;
            if (coord) {
                map.setView(coord, 14); // zoom 14
            }
        }, [switchCoordinate, userPosition, map]);
        return null;
    };

    useEffect(() => {
        axiosGeolocWithGPS(services ?? [], mapCenter[0], mapCenter[1], radius ?? 10)
            .then((data) => {
                setNewGarages(data);

            });
    }, [mapCenter, services, radius]);

    return (
        <Box sx={{display: "flex", width: "100%", height: "75vh", p: 2}}>
            <MapContainer
                center={mapCenter}
                zoom={13}
                style={{width: "100%", height: "100%"}}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <RecenterMap coord={switchCoordinate ?? null}/>

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
