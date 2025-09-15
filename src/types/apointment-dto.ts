export type ApointmentDto = {
    "garageOpeningHours":GarageOpeningHours[];
    "appointment":Appointment[];
}
export type GarageOpeningHours = {
    "dayOfWeek":string;
    "openingHour":string;
    "closingHour":string;
}
export type Appointment = {
    "startDate": string,
    "endDate": string

}