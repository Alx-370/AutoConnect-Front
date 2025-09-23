import type {EventContentArg} from "@fullcalendar/core";
import {Box, Chip, Stack, Typography} from "@mui/material";
import {alpha} from "@mui/material/styles";


export const hueFromId = (id: number) => (id * 47) % 360;
export const colorForId = (id: number) => `hsl(${hueFromId(id)} 70% 45%)`;

const chipSx = (base: string, filled = false) => ({
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "#fff",
    color: filled ? "#fff" : base,
    bgcolor: filled ? base : alpha(base, 0.08),
    "& .MuiChip-deleteIcon": { color: filled ? "#fff" : base },
    "&:hover": { bgcolor: filled ? alpha(base, 0.85) : alpha(base, 0.16) },
});

const renderEventContent = (arg: EventContentArg) => {
    const ext = arg.event.extendedProps as {
        techNames?: string[];
        techIds?: number[];
        customerName?: string;
        customerSurname?: string;
    };
    const names = ext.techNames ?? [];
    const ids = ext.techIds ?? [];

    return (
        <Box px={0.5} py={0.25}>
            <Typography
                variant="body2"
                fontWeight={600}
                lineHeight={1.2}
                sx={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
            >
                {ext.customerName} {ext.customerSurname}
            </Typography>

            {!!names.length && (
                <Stack
                    direction="row"
                    spacing={0.5}
                    flexWrap="wrap"
                    mt={0.25}
                    sx={{ maxHeight: 56, overflow: "hidden", rowGap: 0.5 }}
                >
                    {names.map((n, i) => {
                        const id = Number(ids[i]);
                        const color = Number.isFinite(id) ? colorForId(id) : "#1976d2";
                        return (
                            <Chip key={`${arg.event.id}-tech-${i}`} size="small" label={n} variant="filled" sx={chipSx(color, true)} />
                        );
                    })}
                </Stack>
            )}
        </Box>
    );
};


export default renderEventContent;