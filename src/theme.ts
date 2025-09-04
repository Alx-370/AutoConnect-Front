import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#1976d2" },
        secondary: { main: "#6C757D" },
        background: { default: "#f7f9fc", paper: "#ffffff" },
    },
    typography: {
        fontFamily: "'Inter','Roboto','Helvetica','Arial',sans-serif",
        button: { textTransform: "none", fontWeight: 600 },
        h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    },
    components: {
        MuiButton: {
            defaultProps: { disableRipple: true },
            styleOverrides: {
                root: { borderWidth: 2 },
            },
        },
        MuiTextField: {
            defaultProps: { size: "medium", variant: "outlined" },
        },

        MuiCheckbox: {
            styleOverrides: {
                root: ({ theme }) => ({
                    "&.Mui-checked": { color: theme.palette.primary.main },
                    "&.Mui-checked:active": { color: theme.palette.primary.light },
                    "&:active": { color: theme.palette.text.secondary },
                }),
            },
        },
    },
});

export default theme;
