import {Box, FormControl, IconButton, InputBase, MenuItem, Paper, Select} from "@mui/material";
import Header from "../A_header/Header";
import Footer from "../C_footer/Footer";
import MapGarage from "../../components/MapGarage.tsx";
import "leaflet/dist/leaflet.css";
import BookingSteps from "../../components/BookingSteps.tsx";
import GelocList from "../../components/GelocList.tsx";
import {useState} from "react";
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import type {Geoloc} from "../../types/geoloc.ts";
import CardGeolocGarage from "../../components/CardGeolocGarage.tsx";
import {axiosGeolocWithGPS} from "../../api/axiosGeoloc.ts";


const SearchGarage = () => {
    const [garages, setGarages] = useState<Geoloc[]>([]);
    const [focused, setFocused] = useState(false);
    const [radius, setRadius] = useState(10);
    const [show, setshow] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null);
    const [services, setServices] = useState<number[]>([]);


    const handleGeolocClick = () => {
        if (!navigator.geolocation) {
            alert("La géolocalisation n’est pas supportée par votre navigateur.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lon = pos.coords.longitude;
                console.log("Coordonnées récupérées :", lat, lon);
                console.log("Services sélectionnés :", services);
                axiosGeolocWithGPS(services,lat, lon, radius).then(
                    (data) => {
                        setGarages(data);
                    }
                )


                setUserCoords({lat, lon});
                console.log(
                    "Coordonnées récupérées :",
                    lat,
                    lon,
                    "Services sélectionnés :",
                    services
                )
                setshow(true);
            },
            (err) => {
                console.error("Erreur de géolocalisation :", err);
                alert("Impossible de récupérer votre position.");
            }
        );
    };
    return (
        <>
            <Header/>
            <BookingSteps/>


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
                    <Box sx={{display: show ? "block" : "none"}}>
                        <GelocList searchQuery={searchText} radiusKm={radius} onResult={setGarages}
                                   onServices={(setServices)}/>
                        {garages.map(garage => (
                            <CardGeolocGarage key={garage.id} geoloc={garage}/>
                        ))}
                    </Box>
                </Box>


                <Box sx={{flex: 2}}>
                    <MapGarage  garages={garages}/>

                </Box>
            </Box>

            <Footer/>
        </>
    );
};

            export default SearchGarage;
