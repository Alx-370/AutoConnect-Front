import Header from "../A_header/Header";
import Footer from "../C_footer/Footer";
import {Box, Button} from "@mui/material";
import CarSearch from "../../components/booking/CarSearch.tsx";
import PrestationListContainer from "../../components/booking/PrestationListContainer.tsx";
import BookingSteps from "../../components/booking/BookingSteps.tsx";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import HeroTitle from "../../components/common/HeroTitle.tsx";
import type {CarSelection} from "../../types/car.ts";

const Dashboard = () => {
    const navigate = useNavigate();

    const [immat, setImmat] = useState <string>("");
    const [km, setKm] = useState <string>("");
    const [carSel, setCarSel] = useState <CarSelection> ({} as CarSelection);

    const [selectedServiceIds, setSelectedServiceIds] = useState<Set<number | string>>(new Set());

    const toggleService = (id: number | string) => {
        setSelectedServiceIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const canContinue :boolean = useMemo(() :boolean => {
        const hasService :boolean = selectedServiceIds.size > 0;
        return (
            immat.trim().length > 0 &&
            km.trim().length > 0 &&
            !!carSel.make &&
            !!carSel.model &&
            carSel.year !== null &&
            hasService
        );
    }, [immat, km, carSel, selectedServiceIds]);

    const handleSaveInLocalStorage = () => {
        const payload = {
            immat,
            km,
            make: carSel.make,
            model: carSel.model,
            year: carSel.year,
            services: Array.from(selectedServiceIds),
        };
        localStorage.setItem("ac.selection", JSON.stringify(payload));
        console.log("saved:", payload);
        navigate("/search-garage");
    };

    return (
        <>
            <Header />
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <HeroTitle title="AutoConnect" sx={{ mt: 3 }}/>

                <p style={{ padding: 16, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    La tranquillité commence ici : comparez les meilleurs garages de votre région et optez
                    pour celui qui correspond le mieux à vos attentes.
                </p>

                <BookingSteps activeStep={0} />

                <CarSearch
                    immat={immat}
                    km={km}
                    onChangeImmat={setImmat}
                    onChangeKm={setKm}
                    onChangeCar={setCarSel}
                />



                <PrestationListContainer
                    selectedIds={selectedServiceIds}
                    onToggleId={toggleService}
                />

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <Button
                        onClick={handleSaveInLocalStorage}
                        variant="contained"
                        disabled={!canContinue}
                        sx={{ mt: 2, px: 3, py: 1, borderRadius: 2, textTransform: "none", boxShadow: 2 }}
                    >
                        Voir les garages autour de moi
                    </Button>
                </div>
            </Box>
            <Footer />
        </>
    );
};

export default Dashboard;