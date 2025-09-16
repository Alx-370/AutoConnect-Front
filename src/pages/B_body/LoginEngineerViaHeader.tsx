import Header from "../A_header/Header.tsx";
import HeroTitle from "../../components/common/HeroTitle.tsx";
import Footer from "../C_footer/Footer.tsx";
import {Box} from "@mui/material";
import LoginFormEngineer from "../../components/common/LoginFormEngineer.tsx";


const LoginEngineerViaHeader = () => {
    return (
        <>
            <Header />

            <HeroTitle title="AutoConnect" sx={{ mt: 3 }}/>

            <Box sx={{ width: "100%", display: "grid", placeItems: "center", px: 2, my: 5 }}>
                <LoginFormEngineer />
            </Box>

            <Footer />
        </>
    );
};



export default LoginEngineerViaHeader;