import HeaderWithLogout from "../A_header/HeaderWithLogout.tsx";
import HeroTitle from "../../components/common/HeroTitle.tsx";
import NavbarEngineer from "../../components/common/NavbarEngineer.tsx";
import Footer from "../C_footer/Footer.tsx";


const ManagementEngineer= () => {

    return (

        <>

            <HeaderWithLogout />
            <HeroTitle title="AutoConnect" sx={{ mt: 3 }}/>
            <NavbarEngineer />
            <Footer />

        </>

    );
}


export default ManagementEngineer;