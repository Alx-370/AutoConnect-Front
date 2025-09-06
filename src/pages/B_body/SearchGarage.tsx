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


const SearchGarage = () => {
    const [focused, setFocused] = useState(false);
    const [radius, setRadius] = useState(10);
    const [show, setshow] = useState(false);
    const [searchText, setSearchText] = useState("");
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
                        <IconButton type="button" sx={{p: '10px'}} aria-label="search">
                          < PlaceIcon></PlaceIcon>
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
                        <GelocList searchQuery={searchText} radiusKm={radius}/>
                    </Box>
                </Box>


                <Box sx={{flex: 2}}>
                    <MapGarage/>
                </Box>
            </Box>

            <Footer/>
        </>
    );
};

            export default SearchGarage;
