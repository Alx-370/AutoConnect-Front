export type Geoloc = {
    id: number;
    name: string;
    numeroVoie: string;
    typeVoie: string;
    libelleVoie: string;
    codePostal: string;
    libelleCommune: string;
    codeCommune: string;
    longitude: number;
    latitude: number;
    phoneNumber: string;
};

export type UserLocation = {
    id: number;
    name: string;
    description: string;
};

export type UserLocationDto = {
    userLocation: UserLocation[];
};