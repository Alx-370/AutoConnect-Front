import { useState } from "react";
import {Card, CardHeader, CardContent, Stack, TextField, Button, Typography, Alert, IconButton, InputAdornment, Link} from "@mui/material";
import { Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import { Link as RouterLink } from "react-router";
import axios from "axios";

const GRADIENT = "linear-gradient(90deg,#1976d2,#2196f3)";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const API_BASE = "http://localhost:8080";

type LoginFormProps = {
    onSuccess?: () => void;
    loginFn?: (email: string, password: string) => Promise<void>;
};

const LoginForm = ({ onSuccess, loginFn }: LoginFormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = emailRegex.test(email) && password.length >= 4 && !loading;

    async function defaultLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!canSubmit) return;

        setError(null);
        setLoading(true);
        try {
            const token = window.btoa(`${email}:${password}`);
            await axios.get(`${API_BASE}/auth/login`, {
                headers: { Authorization: `Basic ${token}` },
            });
            localStorage.setItem("ac.auth", token);
            axios.defaults.headers.common["Authorization"] = `Basic ${token}`;
            onSuccess?.();
        } catch (err: unknown) {
            const unauthorized = (axios.isAxiosError(err) && err.response?.status === 401) ?? false;
            const msg = unauthorized ? "Identifiants incorrects." : "Connexion impossible. Réessaie.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        if (loginFn) {
            e.preventDefault();
            setError(null);
            setLoading(true);
            try {
                await loginFn(email, password);
                onSuccess?.();
            } catch (err: unknown) {
                const unauthorized = (axios.isAxiosError(err) && err.response?.status === 401) ?? false;
                const msg = unauthorized ? "Identifiants incorrects." : "Connexion impossible. Réessaie.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        } else {
            await defaultLogin(e);
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
                        Connectez-vous pour finaliser votre rendez-vous
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
                            <Link component={RouterLink} to="/register-user" underline="hover">
                                Créer un compte
                            </Link>
                        </Typography>
                    </Stack>
                </form>
            </CardContent>
        </Card>
    );
};

export default LoginForm;
