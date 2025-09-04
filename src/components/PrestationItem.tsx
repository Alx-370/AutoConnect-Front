import { Button, Stack, Typography } from "@mui/material";
import type { PrestationItem as Prestation } from "../types/prestationItem";

type Props = {
    prestation: Prestation;
    selected?: boolean;
    onToggle?: (p: Prestation) => void;
};

const PrestationItem = ({ prestation, selected = false, onToggle }: Props) => {
    const handleClick = () => {
        if (onToggle) onToggle(prestation);
    };

    return (
        <Button
            type="button"
            onClick={handleClick}
            variant={selected ? "contained" : "outlined"}
            color="primary"
            sx={{
                width: "100%",
                justifyContent: "flex-start",
                textTransform: "none",
                borderWidth: 2,
                p: 2,
            }}
        >
            <Stack alignItems="flex-start" spacing={0.5}>
                <Typography variant="subtitle1">{prestation.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {prestation.description}
                </Typography>
            </Stack>
        </Button>
    );
};

export default PrestationItem;
