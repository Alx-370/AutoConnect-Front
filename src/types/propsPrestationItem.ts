import type { PrestationItem } from "./prestationItem";

export type PrestationItemProps = {
    prestation: PrestationItem;
    selected?: boolean;
    onToggle?: (p: PrestationItem) => void;
};

export type PrestationListContainerProps = {
    selectedIds: Set<number | string>;
    onToggleId: (id: number | string) => void;
};
