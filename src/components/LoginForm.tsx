import {useEffect, useState} from "react";
import {Card, CardHeader, CardContent, Stack, TextField, Button, Typography, Alert, IconButton, InputAdornment, Link} from "@mui/material";
import { Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import { Link as RouterLink } from "react-router";
import {fetchLog, postAppointment} from "../api/axiosLog";
import type {LoginFormState} from "../types/login.ts";

const GRADIENT = "linear-gradient(90deg,#1976d2,#2196f3)";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


type LoginFormProps = {
    onSuccess?: () => void;
    loginFn?: (email: string, password: string) => Promise<void>;
};


const LoginForm = ({ onSuccess, loginFn }: LoginFormProps) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPwd, setShowPwd] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [tokenlocal , setTokenLocal] = useState<string>();
    const [itemLocalStorage, setItemLocalStorage] = useState<LoginFormState>();

    const canSubmit = emailRegex.test(email) && password.length >= 4 && !loading;

    useEffect(() => {
        const saved = localStorage.getItem("ac.selection");
        if (saved) {
            const parsed = JSON.parse(saved);
            setItemLocalStorage(parsed);
            console.log(itemLocalStorage);

        }
    }, []);



    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!canSubmit) return;

        setError(null);
        setLoading(true);
        try {
            if (loginFn) {
                await loginFn(email, password);
            } else {

                await fetchLog(email, password)
                    .then(data => {setTokenLocal(data.token);
                        localStorage.setItem("ac.account", JSON.stringify(tokenlocal));});
            }

            await sendAppointmentAfterLogin();
            onSuccess?.();
        } catch {
            setError("Identifiants incorrects ou service indisponible.");
        } finally {
            setLoading(false);
        }
    }

    async function sendAppointmentAfterLogin(): Promise<void> {
        /*const body = buildAppointmentBodyFromLS();*/

        const selection = localStorage.getItem("ac.selection");
        const account = localStorage.getItem("ac.account");
        if (selection && account) {
            const parsed = JSON.parse(selection);
            const id = parsed.id;
            const appointment = parsed.appointment;
            const startDate = appointment.start;
            const endDate = appointment.end;
            const services = parsed.services;
            const carId = 1;

            const accountparsed = JSON.parse(account);
            const token = accountparsed;
            console.log(startDate);


            postAppointment(token, id,startDate ,endDate ,services, carId)
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
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            type="email"
                            autoComplete="email"
                            required
                            fullWidth
                            slotProps={{ input: { inputProps: { maxLength: 120 } } }}
                        />

                        <TextField
                            label="Mot de passe"
                            value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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
