import { Button, Stack, Typography, Checkbox } from "@mui/material";
import type { PrestationItemProps as Props } from "../types/propsPrestationItem.ts";

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
            aria-pressed={selected}
            sx={{
                width: "100%",
                justifyContent: "flex-start",
                textTransform: "none",
                borderWidth: 2,
                p: 2,
                gap: 1.25,
            }}
        >

            <Checkbox
                size="small"
                checked={selected}
                tabIndex={-1}
                disableRipple
                sx={{ pointerEvents: "none", p: 0 }}
            />

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
