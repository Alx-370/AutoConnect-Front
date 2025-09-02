import type { PrestationItem as Prestation } from "../types/prestationItem";

type Props = { prestation: Prestation };

const PrestationItem = ({ prestation }: Props) => {
    return (
        <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8 }}>
            <h3>{prestation.name}</h3>
            <p>{prestation.description}</p>
        </div>
    );
};

export default PrestationItem;
