import React, { useState } from "react";
import {Alert, Button, Card, CardContent, CardHeader, IconButton, InputAdornment, Link, Stack, TextField, Typography,} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Lock from "@mui/icons-material/Lock";
import { Link as RouterLink } from "react-router";

const GRADIENT = "linear-gradient(90deg,#1976d2,#2196f3)";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginFormEngineer = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPwd, setShowPwd] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = emailRegex.test(email) && password.length >= 4 && !loading;

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!canSubmit) return;

        setLoading(true);
        setError(null);
        try {
            // TODO: remplace par ton appel API d’authentification
            // await loginFn(email, password);
            console.log("Login with:", { email, password });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Échec de la connexion");
        } finally {
            setLoading(false);
        }
    }

    return (
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
                        Connectez-vous pour accéder à votre espace garagiste
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
                                                onClick={() => setShowPwd((v) => !v)}
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
                            <Link component={RouterLink} to="/register-user-engineer" underline="hover">
                                Créer un compte
                            </Link>
                        </Typography>
                    </Stack>
                </form>
            </CardContent>
        </Card>
    );
};

export default LoginFormEngineer;
