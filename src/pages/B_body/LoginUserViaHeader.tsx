import { useState } from "react";
import Header from "../A_header/Header.tsx";
import Footer from "../C_footer/Footer.tsx";
import {Box, Card, CardHeader, CardContent, Stack, TextField, Button, Typography, Alert, IconButton, InputAdornment, Link,} from "@mui/material";
import { Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router";
import { fetchLog } from "../../api/axiosLog.ts";
import HeroTitle from "../../components/common/HeroTitle.tsx";

const GRADIENT = "linear-gradient(90deg,#1976d2,#2196f3)";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// chemin si tu veux rediriger ailleurs
const REDIRECT_AFTER_LOGIN = "/confirmation-appointment";

const LoginUserViaHeader = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = emailRegex.test(email) && password.length >= 4 && !loading;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!canSubmit) return;

        setError(null);
        setLoading(true);
        try {
            const { token } = await fetchLog(email, password);
            localStorage.setItem("ac.account", token);
            navigate(REDIRECT_AFTER_LOGIN, { replace: true });
        } catch {
            setError("Identifiants incorrects ou service indisponible.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <HeroTitle title="AutoConnect" sx={{ mt: 3 }} />

            <Box sx={{ display: "grid", placeItems: "center", px: 2, my: 5 }}>
                <Card
                    sx={{
                        width: "100%",
                        maxWidth: 520,
                        borderRadius: 3,
                        overflow: "hidden",
                        boxShadow: "0 10px 28px rgba(0,0,0,.10)",
                    }}
                >
                    <CardHeader
                        avatar={<Lock sx={{ color: "white" }} />}
                        title={<Typography variant="h6" fontWeight={800}>Connexion</Typography>}
                        subheader={
                            <Typography variant="caption" sx={{ color: "rgba(255,255,255,.9)" }}>
                                Connectez-vous à votre espace automobiliste
                            </Typography>
                        }
                        sx={{ background: GRADIENT, color: "white", "& .MuiCardHeader-title": { fontWeight: 800 } }}
                    />

                    <CardContent sx={{ p: 3 }}>
                        <form onSubmit={handleSubmit} noValidate>
                            <Stack spacing={2}>
                                {error && <Alert severity="error">{error}</Alert>}

                                <TextField
                                    label="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    type="email"
                                    autoComplete="email"
                                    required
                                    fullWidth
                                    slotProps={{ input: { inputProps: { maxLength: 120 } } }}
                                />

                                <TextField
                                    label="Mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    type={showPwd ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    fullWidth
                                    slotProps={{
                                        input: {
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="afficher/masquer le mot de passe"
                                                        onClick={() => setShowPwd(v => !v)}
                                                        edge="end"
                                                    >
                                                        {showPwd ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                            inputProps: { minLength: 4, maxLength: 120 },
                                        },
                                    }}
                                />

                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={!canSubmit}
                                    sx={{ textTransform: "none", py: 1.1, borderRadius: 2 }}
                                >
                                    {loading ? "Connexion..." : "Se connecter"}
                                </Button>

                                <Typography variant="body2" sx={{ textAlign: "center", opacity: 0.85 }}>
                                    Pas de compte ?{" "}
                                    <Link component={RouterLink} to="/register-user-customer" underline="hover">
                                        Créer un compte
                                    </Link>
                                </Typography>
                            </Stack>
                        </form>
                    </CardContent>
                </Card>
            </Box>

            <Footer />
        </>
    );
};

export default LoginUserViaHeader;
