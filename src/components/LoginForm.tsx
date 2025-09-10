import {useEffect, useState} from "react";
import {Card, CardHeader, CardContent, Stack, TextField, Button, Typography, IconButton, InputAdornment, Link} from "@mui/material";
import { Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import { Link as RouterLink } from "react-router";
import {fetchLog} from "../api/axiosLog.ts";
import type {Login} from "../types/login.ts";
import type {QuoteLS} from "../types/quote.ts";

const GRADIENT = "linear-gradient(90deg,#1976d2,#2196f3)";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LoginFormProps = {
    onSuccess?: () => void;
    loginFn?: (email: string, password: string) => Promise<void>;
};

const LoginForm = ({ onSuccess, loginFn }: LoginFormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [data, setData] = useState <Login>();

    const canSubmit = emailRegex.test(email) && password.length >= 4 && !loading;

    const handleSubmit = async (e : any): Promise<void> => {
        e.preventDefault();
        console.log("password", password);
        fetchLog (email, password)
                .then(res =>{
                    setIsLoggedIn(true);
                    setData(res);
                    console.log(res)

                });
    }
//////////////////////////////////////////////////////////////////
    useEffect(() => {
        const raw = localStorage.getItem("ac.selection");
        if (!raw) return {};
        try {
            const parsed = JSON.parse(raw) as QuoteLS;
            const id = parsed.id
            const year = parsed.year
            const services = parsed.services
            return {
                immat: parsed.immat ?? undefined,
                km: parsed.km ?? undefined,
                make: parsed.make ?? null,
                model: parsed.model ?? null,
                year,
                services,
            };
        } catch {
            return {};
        }
    },[isLoggedIn])
///////////////////////////////////////////////////////////////////////////////////////

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
