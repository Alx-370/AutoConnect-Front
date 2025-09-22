import { useState } from "react";
import {Card, CardHeader, CardContent, Stack, TextField, Button, Typography, Alert, Link, Box} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { Link as RouterLink, useNavigate } from "react-router";
import axios from "axios";
import { registerUser } from "../../api/axiosLog";
import type { CustomerRegisterPayload as RegisterPayload } from "../../types/login";
import Header from "../A_header/Header.tsx";
import Footer from "../C_footer/Footer.tsx";
import HeroTitle from "../../components/common/HeroTitle.tsx";

const GRADIENT = "linear-gradient(90deg,#1976d2,#2196f3)";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REDIRECT_AFTER_REGISTER = "/login-user-customer";

type RegisterFormProps = {
    registerFn?: (data: RegisterPayload) => Promise<void>;
};

const RegisterUserViaHeader = ({ registerFn }: RegisterFormProps) => {
    const navigate = useNavigate();

    const [form, setForm] = useState<RegisterPayload>({
        email: "",
        name: "",
        surname: "",
        phone: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit =
        emailRegex.test(form.email) &&
        form.password.trim().length >= 6 &&
        form.name.trim().length >= 2 &&
        form.surname.trim().length >= 2 &&
        form.phone.trim().length >= 6 &&
        !loading;

    function update<K extends keyof RegisterPayload>(key: K) {
        return (e: React.ChangeEvent<HTMLInputElement>) =>
            setForm(prev => ({ ...prev, [key]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!canSubmit) return;

        setError(null);
        setLoading(true);
        try {
            const fn = registerFn ?? registerUser;
            await fn(form);
            navigate(REDIRECT_AFTER_REGISTER, { replace: true });

        } catch (err: unknown) {
            const msg = axios.isAxiosError(err)
                ? err.response?.data?.message ??
                (err.response?.status === 409
                    ? "Un compte existe déjà avec cet email."
                    : "Inscription impossible. Réessaie.")
                : "Inscription impossible. Réessaie.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Header />
            <HeroTitle title="AutoConnect" sx={{ mt: 3 }} />

            <Box
                component="main"
                sx={{
                    display: "grid",
                    placeItems: "center",
                    px: 2,
                    my: 4,
                    minHeight: { xs: "50vh", md: "60vh" },
                }}
            >
                <Card
                    sx={{
                        width: "100%",
                        maxWidth: 560,
                        borderRadius: 3,
                        overflow: "hidden",
                        boxShadow: "0 10px 28px rgba(0,0,0,.10)",
                    }}
                >
                    <CardHeader
                        avatar={<PersonAddAlt1Icon sx={{ color: "white" }} />}
                        title={<Typography variant="h6" fontWeight={800}>Créer un compte</Typography>}
                        subheader={
                            <Typography variant="caption" sx={{ color: "rgba(255,255,255,.9)" }}>
                                Renseignez vos informations pour continuer
                            </Typography>
                        }
                        sx={{ background: GRADIENT, color: "white", "& .MuiCardHeader-title": { fontWeight: 800 } }}
                    />

                    <CardContent sx={{ p: 3 }}>
                        <form onSubmit={handleSubmit} noValidate>
                            <Stack spacing={2}>
                                {error && <Alert severity="error">{error}</Alert>}

                                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                    <TextField label="Prénom" value={form.name} onChange={update("name")} required fullWidth />
                                    <TextField label="Nom" value={form.surname} onChange={update("surname")} required fullWidth />
                                </Stack>

                                <TextField
                                    label="Téléphone"
                                    value={form.phone}
                                    onChange={update("phone")}
                                    type="tel"
                                    autoComplete="tel"
                                    required
                                    fullWidth
                                    slotProps={{ input: { inputProps: { maxLength: 20, inputMode: "tel", pattern: "[0-9+ ]*" } } }}
                                />

                                <TextField
                                    label="Email"
                                    value={form.email}
                                    onChange={update("email")}
                                    type="email"
                                    autoComplete="email"
                                    required
                                    fullWidth
                                />

                                <TextField
                                    label="Mot de passe"
                                    value={form.password}
                                    onChange={update("password")}
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    fullWidth
                                    helperText="6 caractères minimum"
                                />

                                <Button type="submit" variant="contained" disabled={!canSubmit} sx={{ textTransform: "none", py: 1.1, borderRadius: 2 }}>
                                    {loading ? "Création..." : "S'inscrire"}
                                </Button>

                                <Typography variant="body2" sx={{ textAlign: "center", opacity: 0.85 }}>
                                    Déjà un compte ?{" "}
                                    <Link component={RouterLink} to="/login-user-customer" underline="hover">
                                        Se connecter
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

export default RegisterUserViaHeader;
