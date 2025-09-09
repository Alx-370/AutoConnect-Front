import {Box, Card, CardHeader, FormControl, IconButton, InputBase, MenuItem, Paper, Select, Stack, Typography, useMediaQuery} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Header from "../A_header/Header";
import Footer from "../C_footer/Footer";
import MapGarage from "../../components/MapGarage";
import "leaflet/dist/leaflet.css";
import BookingSteps from "../../components/BookingSteps";
import GelocList from "../../components/GelocList";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import PlaceIcon from "@mui/icons-material/Place";
import GarageIcon from "@mui/icons-material/Garage";
import type { Geoloc } from "../../types/geoloc";
import CardGeolocGarage from "../../components/CardGeolocGarage";
import { axiosGeolocWithGPS } from "../../api/axiosGeoloc";

const GRADIENT = "linear-gradient(90deg,#1976d2,#2196f3)";

const SearchGarage = () => {
    const theme = useTheme();
    useMediaQuery(theme.breakpoints.down("md"));
    const [garages, setGarages] = useState<Geoloc[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [radius, setRadius] = useState(10);
    const [show, setShow] = useState(false);
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
                setUserCoords({ lat, lon });
                setShow(true);
                axiosGeolocWithGPS(services, lat, lon, radius).then((data) => setGarages(data));
            },
            (err) => {
                console.error("Erreur de géolocalisation :", err);
                alert("Impossible de récupérer votre position.");
            }
        );
    };


    useEffect(() => {
        if (userCoords) {
            axiosGeolocWithGPS(services, userCoords.lat, userCoords.lon, radius).then((data) =>
                setGarages(data)
            );
        }
    }, [radius]);

    return (
        <>
            <Header />
            <BookingSteps activeStep={1} />

            <Card
                sx={{
                    maxWidth: 1250,
                    mt: 5,
                    mx: "auto",
                    borderRadius: 3,
                    overflow: "hidden",
                    boxShadow: "0 10px 28px rgba(0,0,0,.10)",
                }}
            >
                <CardHeader
                    avatar={<GarageIcon sx={{ color: "white" }} />}
                    title={
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" fontWeight={800}>
                                Trouvez votre garage
                            </Typography>
                        </Stack>
                    }
                    sx={{
                        background: GRADIENT,
                        color: "white",
                        "& .MuiCardHeader-title": { fontWeight: 800 },
                    }}
                />

                {/* Grille responsive : colonne (mobile) → 2 colonnes (desktop) */}
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
                        gap: 2,
                        width: "100%",
                        minHeight: { xs: "auto", md: "70vh" },
                    }}
                >
                    {/* Colonne gauche : recherche + résultats */}
                    <Box
                        sx={{
                            p: { xs: 1.5, sm: 2 },
                            overflow: "hidden",
                        }}
                    >
                        <Paper
                            component="form"
                            onSubmit={(e) => {
                                e.preventDefault();
                                setShow(true);
                            }}
                            sx={{
                                p: 1,
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                                gap: 1,
                                position: { md: "sticky" },
                                top: { md: 8 },
                                zIndex: 1,
                            }}
                        >
                            <IconButton onClick={handleGeolocClick} sx={{ p: "10px" }} aria-label="geoloc">
                                <PlaceIcon color={userCoords ? "primary" : "inherit"} />
                            </IconButton>
                            <InputBase
                                sx={{ ml: 1, flex: 1 }}
                                placeholder="Rechercher une ville, adresse..."
                                inputProps={{ "aria-label": "recherche de garages" }}
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                            />

                            <FormControl variant="outlined" size="small" sx={{ minWidth: 96 }}>
                                <Select
                                    value={radius}
                                    onChange={(e) => setRadius(Number(e.target.value))}
                                    displayEmpty
                                >
                                    <MenuItem value={5}>5 km</MenuItem>
                                    <MenuItem value={10}>10 km</MenuItem>
                                    <MenuItem value={20}>20 km</MenuItem>
                                    <MenuItem value={50}>50 km</MenuItem>
                                </Select>
                            </FormControl>

                            <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                        </Paper>

                        {/* Liste des résultats */}
                        <Box
                            sx={{
                                display: show ? "block" : "none",
                                mt: 2,
                                pr: 0.5,
                                overflowY: "auto",
                                maxHeight: { xs: "40vh", md: "calc(70vh - 72px)" },
                            }}
                        >

                            <GelocList
                                searchQuery={searchText}
                                radiusKm={radius}
                                onResult={setGarages}
                                onServices={setServices}
                            />

                            {garages.map((garage) => (
                                <CardGeolocGarage
                                    key={garage.id}
                                    geoloc={garage}
                                    onResult={setCoordinate}
                                    isOpen={selectedId === garage.id}
                                    onSelect={setSelectedId}
                                />
                            ))}

                            {show && garages.length === 0 && (
                                <Typography variant="body2" sx={{ opacity: 0.7, mt: 1 }}>
                                    Aucun garage trouvé.
                                </Typography>
                            )}
                        </Box>
                    </Box>


                    <Box
                        sx={{
                            px: { xs: 1.5, sm: 2 },
                            pb: { xs: 2, md: 2 },
                        }}
                    >
                        <MapGarage
                            garages={garages}
                            switchCoordinate={coordinate}
                            userPosition={userCoords ? [userCoords.lat, userCoords.lon] : null}
                        />
                    </Box>
                </Box>
            </Card>

            <Footer />
        </>
    );
};

export default SearchGarage;
