import { useNavigate } from "react-router";
import Header from "../A_header/Header.tsx";
import HeroTitle from "../../components/HeroTitle.tsx";
import BookingSteps from "../../components/BookingSteps.tsx";
import {Box} from "@mui/material";
import Footer from "../C_footer/Footer.tsx";
import RegisterForm from "../../components/RegisterForm.tsx";


const RegisterUser = () => {
    const navigate = useNavigate();


    return (
        <>
            <Header />

            <HeroTitle
                title="AutoConnect"
                sx={{ mt: 3 }}
            />

            <BookingSteps activeStep={3} />

            <Box sx={{ width: "100%", display: "grid", placeItems: "center", px: 2, my: 5 }}>
                <RegisterForm onSuccess={() => navigate("/login-user")} />
            </Box>



            <Footer />
        </>
    );
}

export default RegisterUser;