import HeaderWithLogout from "../A_header/HeaderWithLogout.tsx";
import HeroTitle from "../../components/common/HeroTitle.tsx";
import Footer from "../C_footer/Footer.tsx";
import NavbarEngineer from "../../components/common/NavbarEngineer.tsx";


const DashboardEngineer = () => {

    return (

        <>

            <HeaderWithLogout />
            <HeroTitle title="AutoConnect" sx={{ mt: 3 }}/>
            <NavbarEngineer />
            <Footer />

        </>

    );

}



export default DashboardEngineer;