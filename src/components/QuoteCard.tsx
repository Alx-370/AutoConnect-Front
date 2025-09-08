import { useMemo, useState } from "react";
import {Card, CardHeader, CardContent, Divider, Stack, Box, Chip, Typography, List, ListItem, ListItemText, Button, GlobalStyles} from "@mui/material";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import BuildIcon from "@mui/icons-material/Build";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PrintIcon from "@mui/icons-material/Print";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type QuoteLS = {
    immat?: string;
    km?: string;
    make?: string | null;
    model?: string | null;
    year?: number | string | null;
    services?: Array<number | string>;
};

type ServiceItem = { id: number; name: string; price: number };

const SERVICE_CATALOG: Record<number, ServiceItem> = {
    1:  { id: 1,  name: "Vidange + Filtre à Huile",     price: 89 },
    2:  { id: 2,  name: "Pneumatiques",                  price: 90 },
    3:  { id: 3,  name: "Freins",                        price: 140 },
    4:  { id: 4,  name: "Batterie",                      price: 120 },
    5:  { id: 5,  name: "Distribution",                  price: 650 },
    6:  { id: 6,  name: "Amortisseurs",                  price: 320 },
    7:  { id: 7,  name: "Climatisation",                 price: 89 },
    8:  { id: 8,  name: "Diagnostic électronique",       price: 49 },
    9:  { id: 9,  name: "Géométrie / Parallélisme",      price: 79 },
    10: { id: 10, name: "Filtres air & habitacle",       price: 49 },
    11: { id: 11, name: "Bougies / Préchauffage",        price: 89 },
    12: { id: 12, name: "Embrayage",                     price: 690 },
};


const GRADIENT = "linear-gradient(90deg,#1976d2,#2196f3)";
const fmt = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
const LS_KEY = "ac.selection";

const readLS = (): QuoteLS => {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return {};
    try {
        const parsed = JSON.parse(raw) as QuoteLS;

        const year =
            parsed.year === null || parsed.year === undefined || parsed.year === ""
                ? null
                : Number.isFinite(Number(parsed.year))
                    ? Number(parsed.year)
                    : (parsed.year as string);

        const services =
            Array.isArray(parsed.services)
                ? parsed.services.map((v) => Number(v)).filter((n) => Number.isFinite(n))
                : [];

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
};

const computeTotalHT = (serviceIds: number[]) =>
    serviceIds.reduce((sum, id) => sum + (SERVICE_CATALOG[id]?.price ?? 0), 0);

const QuoteCard = () => {
    const [data] = useState<QuoteLS>(() => readLS());

    const servicesIds = useMemo<number[]>(
        () => (Array.isArray(data.services) ? (data.services as number[]) : []),
        [data.services]
    );

    const totalHT = useMemo(() => computeTotalHT(servicesIds), [servicesIds]);
    const tva = useMemo(() => totalHT * 0.2, [totalHT]);
    const totalTTC = useMemo(() => totalHT + tva, [totalHT, tva]);

    const dateStr = useMemo(() => {
        const d = new Date();
        return d.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
    }, []);

    const quoteNumber = useMemo(() => {
        const d = new Date();
        return `DV-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}`;
    }, []);

    const handleValidate = () => {
        const payload = {
            ...data,
            totalHT,
            tva,
            totalTTC,
            quoteNumber,
            validatedAt: new Date().toISOString(),
        };
        localStorage.setItem("ac.selection", JSON.stringify(payload));

    };

    return (
        <>
            {/* Impression */}
            <GlobalStyles styles={{
                "@media print": {
                    "body *": { visibility: "hidden" },
                    "#print-quote, #print-quote *": { visibility: "visible" },
                    "#print-quote": { position: "absolute", left: 0, top: 0, width: "100%", margin: 0, padding: 0 },
                    ".MuiCard-root": { boxShadow: "none", border: "1px solid #ddd" },
                    ".no-print": { display: "none !important" }
                },
                "@page": {
                    margin: "12mm",
                    size: "A4",
                }
            }} />

            <div id="print-quote">
                <Card sx={{ maxWidth: 920, mt: 5, mx: "auto", borderRadius: 3, overflow: "hidden", boxShadow: "0 10px 28px rgba(0,0,0,.10)" }}>
                    <CardHeader
                        avatar={<ReceiptLongIcon sx={{ color: "white" }} />}
                        title={
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6" fontWeight={800}>Devis</Typography>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>{quoteNumber}</Typography>
                            </Stack>
                        }
                        subheader={<Typography variant="caption" sx={{ color: "rgba(255,255,255,.9)" }}>{dateStr}</Typography>}
                        sx={{ background: GRADIENT, color: "white", "& .MuiCardHeader-title": { fontWeight: 800 } }}
                    />

                    <CardContent sx={{ p: 3 }}>
                        {/* Infos véhicule */}
                        <Stack spacing={1.2} mb={2}>
                            <Stack direction="row" alignItems="center" gap={1}>
                                <DirectionsCarFilledIcon />
                                <Typography variant="subtitle1" fontWeight={700}>Véhicule</Typography>
                            </Stack>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                                {data.immat && <Chip label={`Immat: ${data.immat}`} />}
                                {data.make && <Chip label={`Marque: ${data.make}`} />}
                                {data.model && <Chip label={`Modèle: ${data.model}`} />}
                                {data.year != null && data.year !== "" && <Chip label={`Année: ${data.year}`} />}
                                {data.km && <Chip label={`Kilométrage: ${data.km} km`} />}
                            </Box>
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        {/* Prestations */}
                        <Stack spacing={1.2} mb={1}>
                            <Stack direction="row" alignItems="center" gap={1}>
                                <BuildIcon />
                                <Typography variant="subtitle1" fontWeight={700}>Prestations</Typography>
                            </Stack>

                            {servicesIds.length === 0 ? (
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Aucune prestation sélectionnée.
                                </Typography>
                            ) : (
                                <List dense disablePadding>
                                    {servicesIds.map((id) => {
                                        const item = SERVICE_CATALOG[id];
                                        const primary = item?.name ?? `Service #${id}`;
                                        const price = item?.price ?? 0;
                                        return (
                                            <ListItem
                                                key={id}
                                                secondaryAction={<Typography fontWeight={600}>{fmt.format(price)}</Typography>}
                                                sx={{ py: 0.75 }}
                                            >
                                                <ListItemText
                                                    primary={primary}
                                                    slotProps={{ primary: { variant: "body2", sx: { fontSize: 14 } } }}
                                                />
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            )}
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        {/* Totaux */}
                        <Stack gap={0.5} sx={{ ml: "auto", maxWidth: 360 }}>
                            <Row label="Total HT" value={fmt.format(totalHT)} />
                            <Row label="TVA (20%)" value={fmt.format(tva)} />
                            <Row label="Total TTC" value={fmt.format(totalTTC)} strong />
                        </Stack>

                        {/* Actions */}
                        <Stack className="no-print" direction="row" gap={1.5} justifyContent="flex-end" mt={3}>
                            <Button variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()} sx={{ textTransform: "none" }}>
                                Imprimer / PDF
                            </Button>
                            <Button variant="contained" color="success" startIcon={<CheckCircleIcon />} onClick={handleValidate} sx={{ textTransform: "none" }}>
                                Valider
                            </Button>
                        </Stack>

                        <Typography variant="caption" sx={{ display: "block", mt: 1.5, opacity: 0.7 }}>
                            Prix indicatifs HT. Sous réserve d’un contrôle visuel et du modèle exact.
                        </Typography>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

type RowProps = { label: string; value: string; strong?: boolean };
const Row = ({ label, value, strong }: RowProps) => (
    <Stack direction="row" justifyContent="space-between" sx={{ py: 0.25 }}>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>{label}</Typography>
        <Typography variant="body2" fontWeight={strong ? 800 : 600}>{value}</Typography>
    </Stack>
);

export default QuoteCard;
