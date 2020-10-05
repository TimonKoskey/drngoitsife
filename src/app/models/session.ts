// import { Vitals } from './vitals';
import { Payment } from './payment';
// import { DoctorsInput } from './notes';
import { Patient } from './patient';

export interface Session {
    id?: number;
    patient?: Patient
    date?: string;
    status?: string;

    payments?: Array<Payment>;
    // vitals: Vitals;
    // complaints: DoctorsInput;
    // physicalExamination: DoctorsInput;
    // comorbidities: DoctorsInput;
    // investigations: DoctorsInput;
    // diagnosis: DoctorsInput;
    // treatment: DoctorsInput;
    // remarks: DoctorsInput;

    followUpDate?: Date;
    followUpStatus?: string;
    previousSession?: Session;
    nextSession?: Session;
}

