import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PersistenceService, StorageType } from 'angular-persistence';
import { Observable, throwError } from 'rxjs';
import { User } from '../../models/user';
import { Patient } from '../../models/patient';
import { Session } from '../../models/session';
import { Payment } from '../../models/payment';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  patientUrl = `http://127.0.0.1:8000/patients`;
  sessionUrl = `http://127.0.0.1:8000/visits`
  // user: User

  constructor(
    private http: HttpClient,
    private persistence: PersistenceService,
  ) { }

  setUser(user: User) {
    this.persistence.set('user', user, { type: StorageType.SESSION });
  }

  getUser() {
    return this.persistence.get('user', StorageType.SESSION);
  }

  setSession(session: Session) {
    this.persistence.set('session', session, { type: StorageType.SESSION });
  }

  getSession() {
    return this.persistence.get('session', StorageType.SESSION);
  }

  removeSession() {
    this.persistence.remove('session', StorageType.SESSION);
  }

  registerNewPatientToDatabase(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(`${this.patientUrl}/add`, patient);
  }

  getPatientRecordsFromBE(): Observable<Array<Patient>> {
    return this.http.get<Array<Patient>>(`${this.patientUrl}/list`);
  }

  getPatientDetails(patientID: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.patientUrl}/patient/details/${patientID}`);
  }

  updatePatientDetails(patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.patientUrl}/patient/details/${patient.id}`, patient);
  }

  deletePatientDetails(patientID: number): Observable<any> {
    return this.http.delete(`${this.patientUrl}/patient/details/${patientID}`);
  }

  getPatientSessionHistory(patientID: number): Observable<Array<Session>> {
    return this.http.get<Array<Session>>(`${this.sessionUrl}/patient/visits/history/${patientID}`);
  }

  startNewSession(patientID: number): Observable<Session> {
    return this.http.get(`${this.sessionUrl}/create/${patientID}`);
  }

  getActiveSessions(): Observable<Array<Session>> {
    return this.http.get<Array<Session>>(`${this.sessionUrl}/list/active`);
  }

  getFollowUpSessions(): Observable<Array<Session>> {
    return this.http.get<Array<Session>>(`${this.sessionUrl}/list/follow-up`);
  }

  getSessionByDate(dateTimeString: string): Observable<Array<Session>> {
    return this.http.get<Array<Session>>(`${this.sessionUrl}/list/by-date`, {params: {dateTimeString: dateTimeString}});
  }

  getSessionDetails(sessionID: number): Observable<Session> {
    return this.http.get<Session>(`${this.sessionUrl}/session/details/get/${sessionID}`);
  }

  updateSessionDetails(sessionID: number, updateData: any): Observable<Session> {
    return this.http.put<Session>(`${this.sessionUrl}/session/details/update/${sessionID}`, updateData);
  }

  deleteSession(sessionID: number): Observable<Session> {
    return this.http.delete<Session>(`${this.sessionUrl}/session/details/delete/${sessionID}`);
  }

  createPaymentInformation(sessionID: number, payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(`${this.sessionUrl}/payment/create/${sessionID}`, payment);
  }

  getSessionPaymentsList(sessionID: number): Observable<Array<Payment>> {
    return this.http.get<Array<Payment>>(`${this.sessionUrl}/payments/list/${sessionID}`);
  }

  updateSessionPaymentDetails(paymentID: number, payment: Payment): Observable<Payment> {
    return this.http.put<Payment>(`${this.sessionUrl}/payment/details/${paymentID}`, payment);
  }

  deleteSessionPaymentDetails(paymentID: number){
    return this.http.delete(`${this.sessionUrl}/payment/details/${paymentID}`);
  }

}
