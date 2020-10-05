// import { Session } from './session';

export interface Patient {
    id?: number;
    patientRegistrationNumber?: number;
    firstName?: string;
    middleName?: string;
    surname?: string;
    gender?: string;
    age?: string;
    mainPhoneNumber?: string;
    alternativePhoneNumber?: string;
    email?: string;
    county?: string;
    subCounty?: string;
    estateOrArea?: string;
    registrationDate?: Date;
    lastUpdated?: Date;

    // activeSession?: Session;

    // sessionHistory?: Array<Session>;
}



