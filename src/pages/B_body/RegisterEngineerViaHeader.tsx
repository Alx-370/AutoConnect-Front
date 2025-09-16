import Header from "../A_header/Header.tsx";
import HeroTitle from "../../components/common/HeroTitle.tsx";
import {Box} from "@mui/material";
import Footer from "../C_footer/Footer.tsx";
import RegisterFormEngineer from "../../components/common/RegisterFormEngineer.tsx";


const RegisterEngineerViaHeader = () => {
  return(
      <>
          <Header />

          <HeroTitle title="AutoConnect" sx={{ mt: 3 }}/>

          <Box sx={{ width: "100%", display: "grid", placeItems: "center", px: 2, my: 5 }}>
              <RegisterFormEngineer />
          </Box>

          <Footer />
      </>
  );
};

export default RegisterEngineerViaHeader;