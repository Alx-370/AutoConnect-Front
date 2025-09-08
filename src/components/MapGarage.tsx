import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {type LatLngTuple} from "leaflet";
import {useState, useEffect} from "react";
import {Box} from "@mui/material";




const MapGarage = () => {
    const [position, setPosition] = useState<LatLngTuple>([0, 0]);
    const center: LatLngTuple = [46.7036, 0.8489];

    useEffect(() => {
        setPosition(center);
    }, [setPosition]);

    return (
        <Box sx={{display: "flex", width: "100%", height: "75vh" , pt: 4, pr: 4, pb: 1, pl: 4}}>



            <MapContainer
                center={[46.7036, 0.8489]} // Ligueil
                zoom={13}
                style={{width: "100%"}}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> '
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center}>
                    <Popup>Ligueil 📍</Popup>
                </Marker>
            </MapContainer>
        </Box>
    );
};

export default MapGarage;
