import { Box, Typography, Link } from "@mui/material";


const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                mt: 4,
                py: 3,
                px: 2,
                background: "linear-gradient(90deg,#1976d2,#2196f3)",
                color: "white",
                textAlign: "center",
            }}
        >
            <Typography variant="h6" sx={{ mb: 1 }}>
                AutoConnect
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
                Comparez les garages auto près de chez vous et prenez rendez-vous en ligne.
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 2 }}>
                <Link href="/contact" color="inherit" underline="hover">Contact</Link>
                <Link href="/cgu" color="inherit" underline="hover">Mentions légales</Link>
            </Box>

            <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                © {new Date().getFullYear()} AutoConnect — Tous droits réservés
            </Typography>
        </Box>
    );
};

export default Footer;
