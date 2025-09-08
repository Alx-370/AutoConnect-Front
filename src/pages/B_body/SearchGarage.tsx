import {Box, Card, CardHeader, FormControl, IconButton, InputBase, MenuItem, Paper, Select, Stack, Typography} from "@mui/material";
import Header from "../A_header/Header";
import Footer from "../C_footer/Footer";
import MapGarage from "../../components/MapGarage.tsx";
import "leaflet/dist/leaflet.css";
import BookingSteps from "../../components/BookingSteps.tsx";
import GelocList from "../../components/GelocList.tsx";
import {useEffect, useState} from "react";
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import GarageIcon from "@mui/icons-material/Garage";
import type {Geoloc} from "../../types/geoloc.ts";
import CardGeolocGarage from "../../components/CardGeolocGarage.tsx";
import {axiosGeolocWithGPS} from "../../api/axiosGeoloc.ts";


const GRADIENT = "linear-gradient(90deg,#1976d2,#2196f3)";

const SearchGarage = () => {
    const [garages, setGarages] = useState<Geoloc[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [radius, setRadius] = useState(10);
    const [show, setshow] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);
    const [services, setServices] = useState<number[]>([]);
    const [coordinate, setCoordinate] = useState<[number, number] | null>(null);

    const handleGeolocClick = () => {
        if (!navigator.geolocation) {
            alert("La géolocalisation n’est pas supportée par votre navigateur.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                setUserCoords({lat, lon});
                setshow(true);
                console.log("Coordonnées récupérées :", lat, lon);
                console.log("Services sélectionnés :", services);
                axiosGeolocWithGPS(services,lat, lon, radius).then(
                    (data) => {
                        setGarages(data);
                    }
                )



                console.log(
                    "Coordonnées récupérées :",
                    lat,
                    lon,
                    "Services sélectionnés :",
                    services
                )
            },
            (err) => {
                console.error("Erreur de géolocalisation :", err);
                alert("Impossible de récupérer votre position.");
            }
        );

    };
    useEffect(() => {
        if (userCoords) {
            axiosGeolocWithGPS(services, userCoords.lat, userCoords.lon, radius).then((data) => {
                setGarages(data);
            });
        }
    }, [radius]);

    return (
        <>
            <Header/>

            <BookingSteps activeStep={1} />
            <Card sx={{ maxWidth: 1250, mt: 5, mx: "auto", borderRadius: 3, overflow: "hidden", boxShadow: "0 10px 28px rgba(0,0,0,.10)" }}>
                <CardHeader
                    avatar={<GarageIcon sx={{ color: "white" }} />}
                    title={
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" fontWeight={800}>Trouvez votre garage</Typography>

                        </Stack>
                    }

                    sx={{ background: GRADIENT, color: "white", "& .MuiCardHeader-title": { fontWeight: 800 } }}
                />

            <Box sx={{display: "flex", width: "100%", height: "85vh"}}>

                <Box sx={{flex: 1, p: 2}}>
                    <Paper
                        component="form"
                        sx={{p: '2px 4px', display: 'flex', alignItems: 'center', width: 500}}
                    >
                        <IconButton onClick={handleGeolocClick} sx={{p: '10px'}} aria-label="geoloc">
                            <PlaceIcon color={userCoords ? "primary" : "inherit"}/>
                        </IconButton>
                        <InputBase
                            sx={{ml: 1, flex: 1}}
                            placeholder="Search Google Maps"
                            inputProps={{'aria-label': 'search google maps'}}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <IconButton type="button" sx={{p: '10px'}} aria-label="search">
                            <SearchIcon onClick={() => setshow(true)}/>
                        </IconButton>
                        <FormControl variant="outlined" size="small">
                            <Select
                                value={radius}
                                onChange={(e) => setRadius(Number(e.target.value))}
                            >
                                <MenuItem value={5}>5 km</MenuItem>
                                <MenuItem value={10}>10 km</MenuItem>
                                <MenuItem value={20}>20 km</MenuItem>
                                <MenuItem value={50}>50 km</MenuItem>
                            </Select>
                        </FormControl>

                    </Paper>
                    <Box sx={{display: show ? "block" : "none", m: 2}}>
                        <GelocList searchQuery={searchText} radiusKm={radius} onResult={setGarages}
                                   onServices={(setServices)}/>
                        {garages.map(garage => (
                            <CardGeolocGarage key={garage.id} geoloc={garage} onResult={setCoordinate}
                                              isOpen={selectedId === garage.id}
                                              onSelect={setSelectedId}/>
                        ))}
                    </Box>

                </Box>


                <Box sx={{flex: 2}}>
                    <MapGarage  garages={garages}   switchCoordinate={coordinate} userPosition={userCoords ? [userCoords.lat, userCoords.lon] : null} />

                </Box>
            </Box>
                </Card>

            <Footer/>
        </>
    );
};

            export default SearchGarage;
