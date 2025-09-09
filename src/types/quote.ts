export type ServiceItem = { id: number; name: string; price: number };

export type QuoteLS = {

    immat?: string;
    km?: string;
    make?: string | null;
    model?: string | null;
    year?: number | string | null;
    services?: number[];


    id?: number;
    name?: string;
    typeVoie?: string;
    libelleVoie?: string;
    codePostal?: string;
    libelleCommune?: string;
    phoneNumber?: string;
    appointment?: { start: string; end: string };
    totalHT?: number;
    tva?: number;
    totalTTC?: number;
    quoteNumber?: string;
    validatedAt?: string;
};
