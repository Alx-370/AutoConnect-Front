export type QuoteLS = {
    immat?: string;
    km?: string;
    make?: string | null;
    model?: string | null;
    year?: number | string | null;
    services?: Array<number | string>;
};

export type ServiceItem = {
    id: number;
    name: string;
    price: number;
};
