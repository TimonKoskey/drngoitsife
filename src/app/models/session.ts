// import { Vitals } from './vitals';
import { Payment } from './payment';
import { Notes } from './notes';
import { Patient } from './patient';

export interface Session {
    id?: number;
    patient?: Patient
    date?: string;
    status?: string;

    payments?: Array<Payment>;
    // vitals: Vitals;
    complaints?: Notes;
    physicalExams?: Notes;
    comorbidities?: Notes;
    investigations?: Notes;
    diagnosis?: Notes;
    treatment?: Notes;
    remarks?: Notes;

    followUpDate?: Date;
    followUpStatus?: string;
}

export interface MergedSessions {
    id?: number;
    previous?: Session;
    next?: Session;
}

