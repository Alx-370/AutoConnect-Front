import React, { useEffect, useState } from "react";
import {Card, CardHeader, CardContent, Stack, TextField, Button, Typography, Alert, Link, Switch, FormControlLabel, Box, Stepper, Step, StepLabel, IconButton, Autocomplete, Paper, Chip} from "@mui/material";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Link as RouterLink } from "react-router";
import axios from "axios";

const GRADIENT = "linear-gradient(90deg,#1976d2,#2196f3)";
const API_BASE = import.meta.env.VITE_API_BASE;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const sirenRegex = /^\d{9}$/;

type DayKey = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
type DayHours = { open: boolean; start: string; end: string };
type OpeningHours = Record<DayKey, DayHours>;

type ServiceCatalogItem = { id: number; name: string; description: string };
type OfferDraft = { serviceId: number | null; price: number | ""; durationMinutes: number | "" };

type RegisterPayload = {
    email: string;
    name: string;
    surname: string;
    phone: string;
    password: string;
    siren: string;
    openingHours: OpeningHours;
    services: { serviceId: number; price: number; durationMinutes: number }[];
};

const DAYS: { key: DayKey; label: string }[] = [
    { key: "monday", label: "Lundi" },
    { key: "tuesday", label: "Mardi" },
    { key: "wednesday", label: "Mercredi" },
    { key: "thursday", label: "Jeudi" },
    { key: "friday", label: "Vendredi" },
    { key: "saturday", label: "Samedi" },
    { key: "sunday", label: "Dimanche" },
];

const defaultHours: OpeningHours = {
    monday: { open: true, start: "09:00", end: "18:00" },
    tuesday: { open: true, start: "09:00", end: "18:00" },
    wednesday: { open: true, start: "09:00", end: "18:00" },
    thursday: { open: true, start: "09:00", end: "18:00" },
    friday: { open: true, start: "09:00", end: "18:00" },
    saturday: { open: false, start: "09:00", end: "12:00" },
    sunday: { open: false, start: "09:00", end: "12:00" },
};

const DEFAULT_CATALOG: ServiceCatalogItem[] = [
    { id:1,  name:"Vidange + Filtre à Huile", description:"Vidange, filtre, joint, niveaux, reset maintenance." },
    { id:2,  name:"Pneumatiques", description:"Montage/équilibrage, valves, pressions, TPMS." },
    { id:3,  name:"Freins", description:"Disques/plaquettes, purge, contrôles, essai." },
    { id:4,  name:"Batterie", description:"Test capacité/charge, remplacement, BMS." },
    { id:5,  name:"Distribution", description:"Kit + pompe à eau si prévu, purge LDR." },
    { id:6,  name:"Amortisseurs", description:"Remplacement AV/AR, couples, géométrie conseillée." },
    { id:7,  name:"Climatisation", description:"Vide, recharge, traceur UV, perf." },
    { id:8,  name:"Diagnostic électronique", description:"Codes défauts, mesures, rapport." },
    { id:9,  name:"Géométrie / Parallélisme", description:"Mesure 3D, réglages, rapport." },
    { id:10, name:"Filtres air & habitacle", description:"Remplacement + nettoyage logement." },
    { id:11, name:"Bougies / Préchauffage", description:"Remplacement + contrôles, couples." },
    { id:12, name:"Embrayage", description:"Kit, purge, contrôle VM, essai." },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <Paper variant="outlined" sx={{ p: { xs: 1.5, sm: 2 }, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                {title}
            </Typography>
            {children}
        </Paper>
    );
}

const RegisterFormEngineer = () => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const [catalog, setCatalog] = useState<ServiceCatalogItem[]>([]);
    const [form, setForm] = useState({
        email: "",
        name: "",
        surname: "",
        phone: "",
        password: "",
        siren: "",
        openingHours: defaultHours as OpeningHours,
        servicesDraft: [{ serviceId: null, price: "", durationMinutes: "" }] as OfferDraft[],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const { data } = await axios.get<ServiceCatalogItem[]>(`${API_BASE}/services`);
                if (mounted) setCatalog(Array.isArray(data) ? data : DEFAULT_CATALOG);
            } catch {
                if (mounted) setCatalog(DEFAULT_CATALOG);
            }
        })();
        return () => { mounted = false; };
    }, []);

    const step1Valid =
        emailRegex.test(form.email) &&
        form.password.trim().length >= 6 &&
        form.name.trim().length >= 2 &&
        form.surname.trim().length >= 2 &&
        form.phone.trim().length >= 6 &&
        sirenRegex.test(form.siren);

    const scheduleValid = Object.values(form.openingHours).every(d =>
        !d.open || (!!d.start && !!d.end && d.start < d.end)
    );

    const normalizedServices = form.servicesDraft.map((s) => ({
        serviceId: s.serviceId ?? NaN,
        price: typeof s.price === "number" ? s.price : s.price === "" ? NaN : Number(s.price),
        durationMinutes:
            typeof s.durationMinutes === "number"
                ? s.durationMinutes
                : s.durationMinutes === ""
                    ? NaN
                    : Number(s.durationMinutes),
    }));

    const isRowEmpty = (s: {serviceId:number; price:number; durationMinutes:number}) =>
        !Number.isFinite(s.serviceId) && (isNaN(s.price) || s.price === 0) && (isNaN(s.durationMinutes) || s.durationMinutes === 0);

    const isRowValid = (s: {serviceId:number; price:number; durationMinutes:number}) =>
        Number.isFinite(s.serviceId) && !isNaN(s.price) && s.price >= 0 && !isNaN(s.durationMinutes) && s.durationMinutes > 0;

    const someInvalid = normalizedServices.some(s => !isRowEmpty(s) && !isRowValid(s));
    const step3Valid = !someInvalid;

    const canSubmit = step1Valid && scheduleValid && step3Valid && !loading;

    function update<K extends "email"|"name"|"surname"|"phone"|"password"|"siren">(key: K) {
        return (e: React.ChangeEvent<HTMLInputElement>) =>
            setForm(prev => ({ ...prev, [key]: e.target.value }));
    }
    function toggleDay(day: DayKey, open: boolean) {
        setForm(prev => ({
            ...prev,
            openingHours: { ...prev.openingHours, [day]: { ...prev.openingHours[day], open } },
        }));
    }
    function setDayTime(day: DayKey, field: "start" | "end", value: string) {
        setForm(prev => ({
            ...prev,
            openingHours: { ...prev.openingHours, [day]: { ...prev.openingHours[day], [field]: value } },
        }));
    }
    function setServiceId(idx: number, serviceId: number | null) {
        setForm(prev => {
            const copy = [...prev.servicesDraft];
            copy[idx] = { ...copy[idx], serviceId };
            return { ...prev, servicesDraft: copy };
        });
    }

    function updateService(idx: number, field: "price" | "durationMinutes", value: string) {
        const toNumOrEmpty = (v: string): number | "" => {
            if (v === "") return "";
            const n = Number(v);
            return Number.isNaN(n) ? "" : n;
        };
        setForm(prev => {
            const copy = [...prev.servicesDraft];
            const row: OfferDraft = { ...copy[idx] };
            const parsed = toNumOrEmpty(value);
            if (field === "price") row.price = parsed;
            else row.durationMinutes = parsed;
            copy[idx] = row;
            return { ...prev, servicesDraft: copy };
        });
    }

    function addService() {
        setForm(prev => ({ ...prev, servicesDraft: [...prev.servicesDraft, { serviceId: null, price: "", durationMinutes: "" }] }));
    }
    function removeService(idx: number) {
        setForm(prev => {
            const copy = [...prev.servicesDraft];
            copy.splice(idx, 1);
            return { ...prev, servicesDraft: copy.length ? copy : [{ serviceId: null, price: "", durationMinutes: "" }] };
        });
    }

    function copyMondayToWeekdays() {
        setForm(prev => {
            const src = prev.openingHours.monday;
            const next = { ...prev.openingHours };
            (["tuesday","wednesday","thursday","friday"] as DayKey[]).forEach(d => next[d] = { ...src });
            return { ...prev, openingHours: next };
        });
    }
    function applyToAllDays() {
        setForm(prev => {
            const src = prev.openingHours.monday;
            const next: OpeningHours = { ...prev.openingHours };
            (Object.keys(next) as DayKey[]).forEach(d => next[d] = { ...src });
            return { ...prev, openingHours: next };
        });
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!canSubmit) return;

        const servicesClean = normalizedServices.filter(isRowValid);
        const payload: RegisterPayload = {
            email: form.email,
            name: form.name,
            surname: form.surname,
            phone: form.phone,
            password: form.password,
            siren: form.siren,
            openingHours: form.openingHours,
            services: servicesClean as { serviceId:number; price:number; durationMinutes:number }[],
        };

        setError(null);
        setLoading(true);
        try {
            await axios.post(`${API_BASE}/auth/created`, payload, {
                headers: { "Content-Type": "application/json" },
            });
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

    function optionsForRow(currentId: number | null) {
        const selected = new Set(form.servicesDraft.map(s => s.serviceId).filter(Boolean) as number[]);
        return catalog.filter(s => !selected.has(s.id) || s.id === currentId);
    }

    return (
        <Card
            sx={{
                width: "100%",
                maxWidth: 760,
                mx: "auto",
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 10px 28px rgba(0,0,0,.10)",
            }}
        >
            <CardHeader
                avatar={<PersonAddAlt1Icon sx={{ color: "white" }} />}
                title={<Typography variant="h6" fontWeight={800}>Créer un compte garagiste</Typography>}
                subheader={
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,.9)" }}>
                        Étape {activeStep + 1} sur 3
                    </Typography>
                }
                sx={{ background: GRADIENT, color: "white", "& .MuiCardHeader-title": { fontWeight: 800 } }}
            />

            <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
                    <Step><StepLabel>Informations</StepLabel></Step>
                    <Step><StepLabel>Horaires</StepLabel></Step>
                    <Step><StepLabel>Prestations</StepLabel></Step>
                </Stepper>

                <form onSubmit={handleSubmit} noValidate>
                    <Stack spacing={2}>
                        {error && <Alert severity="error">{error}</Alert>}

                        {activeStep === 0 && (
                            <Stack spacing={2}>
                                <Section title="Identité">
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        <TextField label="Prénom" value={form.name} onChange={update("name")} required fullWidth />
                                        <TextField label="Nom" value={form.surname} onChange={update("surname")} required fullWidth />
                                    </Stack>
                                </Section>

                                <Section title="Contact">
                                    <Stack spacing={2}>
                                        <TextField
                                            label="Téléphone"
                                            value={form.phone}
                                            onChange={update("phone")}
                                            type="tel"
                                            autoComplete="tel"
                                            required
                                            fullWidth
                                            slotProps={{
                                                input: {
                                                    inputProps: { maxLength: 20, inputMode: "tel", pattern: "[0-9+ ]*" }
                                                }
                                            }}
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
                                    </Stack>
                                </Section>

                                <Section title="Sécurité">
                                    <TextField
                                        label="Mot de passe"
                                        value={form.password}
                                        onChange={update("password")}
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        fullWidth
                                        helperText="6 caractères minimum"
                                        slotProps={{
                                            input: {
                                                inputProps: { minLength: 6, maxLength: 120 }
                                            }
                                        }}
                                    />
                                </Section>

                                <Section title="Identifiant professionnel">
                                    <TextField
                                        label="SIREN (9 chiffres)"
                                        value={form.siren}
                                        onChange={update("siren")}
                                        required
                                        fullWidth
                                        error={form.siren.length > 0 && !sirenRegex.test(form.siren)}
                                        helperText={
                                            form.siren.length > 0 && !sirenRegex.test(form.siren)
                                                ? "Le SIREN doit contenir exactement 9 chiffres."
                                                : " "
                                        }
                                        slotProps={{
                                            input: {
                                                inputProps: { maxLength: 9, inputMode: "numeric", pattern: "[0-9]*", autoComplete: "off" }
                                            }
                                        }}
                                    />
                                </Section>
                            </Stack>
                        )}

                        {activeStep === 1 && (
                            <Stack spacing={2}>
                                <Section title="Jours & horaires d’ouverture">
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ mb: 1 }}>
                                        <Button size="small" variant="outlined" startIcon={<ContentCopyIcon />} onClick={copyMondayToWeekdays} sx={{ textTransform: "none" }}>
                                            Copier Lundi → Ven
                                        </Button>
                                        <Button size="small" variant="outlined" startIcon={<ContentCopyIcon />} onClick={applyToAllDays} sx={{ textTransform: "none" }}>
                                            Appliquer à tous
                                        </Button>
                                    </Stack>

                                    <Stack spacing={1}>
                                        {DAYS.map(({ key, label }) => {
                                            const d = form.openingHours[key];
                                            const invalid = d.open && (!!d.start && !!d.end) ? d.start >= d.end : false;

                                            return (
                                                <Paper key={key} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                                                    <Box
                                                        sx={{
                                                            display: "grid",
                                                            gap: 1,
                                                            gridTemplateColumns: { xs: "1fr", sm: "1.2fr 1fr 1fr" },
                                                        }}
                                                    >
                                                        <FormControlLabel
                                                            control={<Switch checked={d.open} onChange={(_, v) => toggleDay(key, v)} />}
                                                            label={<Typography fontWeight={600}>{label}</Typography>}
                                                        />

                                                        <TextField
                                                            type="time"
                                                            label="Ouverture"
                                                            value={d.start}
                                                            onChange={(e) => setDayTime(key, "start", e.target.value)}
                                                            disabled={!d.open}
                                                            error={invalid}
                                                            fullWidth
                                                            slotProps={{ input: { inputProps: { step: 300 } } }}
                                                        />
                                                        <TextField
                                                            type="time"
                                                            label="Fermeture"
                                                            value={d.end}
                                                            onChange={(e) => setDayTime(key, "end", e.target.value)}
                                                            disabled={!d.open}
                                                            error={invalid}
                                                            helperText={invalid ? "Heure d’ouverture doit être < fermeture" : " "}
                                                            fullWidth
                                                            slotProps={{ input: { inputProps: { step: 300 } } }}
                                                        />
                                                    </Box>
                                                </Paper>
                                            );
                                        })}
                                    </Stack>
                                </Section>

                                {!scheduleValid && (
                                    <Alert severity="warning">Corrige les horaires invalides (ouverture &lt; fermeture).</Alert>
                                )}
                            </Stack>
                        )}

                        {activeStep === 2 && (
                            <Stack spacing={2}>
                                <Section title="Prestations proposées">
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        Sélectionne dans le catalogue puis indique le prix (€) et la durée (min).
                                    </Typography>

                                    <Stack spacing={1.25}>
                                        {form.servicesDraft.map((row, idx) => {
                                            const options = optionsForRow(row.serviceId);
                                            const current = row.serviceId != null ? catalog.find(s => s.id === row.serviceId) ?? null : null;

                                            const price = typeof row.price === "number" ? row.price : Number(row.price);
                                            const dur = typeof row.durationMinutes === "number" ? row.durationMinutes : Number(row.durationMinutes);
                                            const empty = row.serviceId == null && (isNaN(price) || price === 0) && (isNaN(dur) || dur === 0);
                                            const invalid = !empty && !(row.serviceId != null && !isNaN(price) && price >= 0 && !isNaN(dur) && dur > 0);

                                            return (
                                                <Paper key={idx} variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
                                                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                                                        <Stack direction="row" spacing={1} alignItems="center">
                                                            <Chip size="small" label={`#${idx + 1}`} />
                                                            <Typography variant="subtitle2" fontWeight={700}>
                                                                {current?.name || "Nouvelle prestation"}
                                                            </Typography>
                                                        </Stack>
                                                        <IconButton aria-label="Supprimer la ligne" onClick={() => removeService(idx)} size="small">
                                                            <DeleteOutlineIcon />
                                                        </IconButton>
                                                    </Stack>

                                                    <Box
                                                        sx={{
                                                            display: "grid",
                                                            gap: 1,
                                                            gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr 1fr" },
                                                        }}
                                                    >
                                                        <Autocomplete<ServiceCatalogItem, false, false, false>
                                                            options={options}
                                                            getOptionLabel={(o) => o.name}
                                                            value={current}
                                                            onChange={(_, val) => setServiceId(idx, val ? val.id : null)}
                                                            isOptionEqualToValue={(a, b) => a.id === b.id}
                                                            renderInput={(p) => (
                                                                <TextField
                                                                    {...p}
                                                                    label="Prestation (catalogue)"
                                                                    fullWidth
                                                                    helperText={current?.description || " "}
                                                                    error={invalid && row.serviceId == null}
                                                                />
                                                            )}
                                                        />

                                                        <TextField
                                                            label="Prix (€)"
                                                            type="number"
                                                            value={row.price}
                                                            onChange={(e) => updateService(idx, "price", e.target.value)}
                                                            fullWidth
                                                            slotProps={{ input: { inputProps: { step: "0.01", min: "0" } } }}
                                                            error={invalid && (isNaN(price) || price < 0)}
                                                        />

                                                        <TextField
                                                            label="Durée (min)"
                                                            type="number"
                                                            value={row.durationMinutes}
                                                            onChange={(e) => updateService(idx, "durationMinutes", e.target.value)}
                                                            fullWidth
                                                            slotProps={{ input: { inputProps: { step: "5", min: "1" } } }}
                                                            error={invalid && (isNaN(dur) || dur <= 0)}
                                                            helperText={invalid ? "Choisis une prestation + prix >= 0 + durée > 0" : " "}
                                                        />
                                                    </Box>
                                                </Paper>
                                            );
                                        })}

                                        <Button
                                            type="button"
                                            variant="outlined"
                                            startIcon={<AddCircleOutlineIcon />}
                                            onClick={addService}
                                            sx={{ alignSelf: { xs: "stretch", sm: "flex-start" }, textTransform: "none" }}
                                            disabled={catalog.length > 0 && form.servicesDraft.filter(s => s.serviceId != null).length >= catalog.length}
                                        >
                                            Ajouter une prestation
                                        </Button>

                                        {!step3Valid && (
                                            <Alert severity="warning">
                                                Certaines lignes sont incomplètes. Sois complet (prestation + prix + durée) ou laisse la ligne vide.
                                            </Alert>
                                        )}
                                    </Stack>
                                </Section>
                            </Stack>
                        )}

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} justifyContent="space-between">
                            {activeStep > 0 ? (
                                <Button variant="text" onClick={() => setActiveStep(activeStep - 1)} sx={{ textTransform: "none" }}>
                                    Retour
                                </Button>
                            ) : <span />}

                            {activeStep < 2 ? (
                                <Button
                                    variant="contained"
                                    onClick={() => setActiveStep(activeStep + 1)}
                                    disabled={(activeStep === 0 && !step1Valid) || (activeStep === 1 && !scheduleValid)}
                                    sx={{ textTransform: "none" }}
                                >
                                    Continuer
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={!canSubmit}
                                    sx={{ textTransform: "none" }}
                                >
                                    {loading ? "Création..." : "Créer mon compte"}
                                </Button>
                            )}
                        </Stack>

                        <Typography variant="body2" sx={{ textAlign: "center", opacity: 0.85 }}>
                            Déjà un compte ?{" "}
                            <Link component={RouterLink} to="/login-user-engineer" underline="hover">
                                Se connecter
                            </Link>
                        </Typography>
                    </Stack>
                </form>
            </CardContent>
        </Card>
    );
};

export default RegisterFormEngineer;
