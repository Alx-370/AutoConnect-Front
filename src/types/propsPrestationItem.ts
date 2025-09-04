import type { PrestationItem } from "./prestationItem";

export type PrestationItemProps = {
    prestation: PrestationItem;
    selected?: boolean;
    onToggle?: (p: PrestationItem) => void;
};
