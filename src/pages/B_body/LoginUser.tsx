import Header from "../A_header/Header.tsx";
import BookingSteps from "../../components/BookingSteps.tsx";
import Footer from "../C_footer/Footer.tsx";
import LoginForm from "../../components/LoginForm.tsx";
import HeroTitle from "../../components/HeroTitle.tsx";
import { Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router";

const LoginUser = () => {
    const navigate = useNavigate();
    const location = useLocation() as { state?: { from?: string } };
    const from = location.state?.from ?? "/";

    return (
        <>
            <Header />

            <HeroTitle
                title="AutoConnect"
                sx={{ mt: 3 }}
            />

            <BookingSteps activeStep={3} />

            <Box sx={{ width: "100%", display: "grid", placeItems: "center", px: 2, my: 5 }}>
                <LoginForm onSuccess={() => navigate(from, { replace: true })} />
            </Box>

            <Footer />
        </>
    );
};

export default LoginUser;
