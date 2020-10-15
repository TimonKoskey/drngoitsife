import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PersistenceService, StorageType } from 'angular-persistence';
import { Observable, throwError } from 'rxjs';
import { User } from '../../models/user';
import { Patient } from '../../models/patient';
import { Session, MergedSessions } from '../../models/session';
import { Payment } from '../../models/payment';
import { Notes } from '../../models/notes';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  patientUrl = `http://10.128.0.8:8000/patients`;
  sessionUrl = `http://10.128.0.8:8000/visits`
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

  checkIfPatientExists(patient: Patient): Observable<Array<Patient>> {
    return this.http.post<Array<Patient>>(`${this.patientUrl}/check`, patient);
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
    return this.http.put<Patient>(`${this.patientUrl}/patient/details/update/${patient.id}`, patient);
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

  createSessionComplaints(sessionID: number, notes: Notes): Observable<Notes> {
    return this.http.post<Notes>(`${this.sessionUrl}/complaints/create/${sessionID}`, notes);
  }

  getSessionComplaints(sessionID: number): Observable<Notes> {
    return this.http.get<Notes>(`${this.sessionUrl}/complaints/details/${sessionID}`);
  }

  updateSessionComplaintsDetails(notesID: number, notes: Notes): Observable<Notes> {
    return this.http.put<Notes>(`${this.sessionUrl}/complaints/update/${notesID}`, notes);
  }

  createSessionPhycExam(sessionID: number, notes: Notes): Observable<Notes> {
    return this.http.post<Notes>(`${this.sessionUrl}/physc-exams/create/${sessionID}`, notes);
  }

  getSessionPhycExam(sessionID: number): Observable<Notes> {
    return this.http.get<Notes>(`${this.sessionUrl}/physc-exams/details/${sessionID}`);
  }

  updateSessionPhycExam(notesID: number, notes: Notes): Observable<Notes> {
    return this.http.put<Notes>(`${this.sessionUrl}/physc-exams/update/${notesID}`, notes);
  }

  createSessionComorbities(sessionID: number, notes: Notes): Observable<Notes> {
    return this.http.post<Notes>(`${this.sessionUrl}/comorbidities/create/${sessionID}`, notes);
  }

  getSessionComorbities(sessionID: number): Observable<Notes> {
    return this.http.get<Notes>(`${this.sessionUrl}/comorbidities/details/${sessionID}`);
  }

  updateSessionComorbities(notesID: number, notes: Notes): Observable<Notes> {
    return this.http.put<Notes>(`${this.sessionUrl}/comorbidities/update/${notesID}`, notes);
  }

  createSessionInvestigations(sessionID: number, notes: Notes): Observable<Notes> {
    return this.http.post<Notes>(`${this.sessionUrl}/investigations/create/${sessionID}`, notes);
  }

  getSessionInvestigations(sessionID: number): Observable<Notes> {
    return this.http.get<Notes>(`${this.sessionUrl}/investigations/details/${sessionID}`);
  }

  updateSessionInvestigations(notesID: number, notes: Notes): Observable<Notes> {
    return this.http.put<Notes>(`${this.sessionUrl}/investigations/update/${notesID}`, notes);
  }

  createSessionDiagnosis(sessionID: number, notes: Notes): Observable<Notes> {
    return this.http.post<Notes>(`${this.sessionUrl}/diagnosis/create/${sessionID}`, notes);
  }

  getSessionDiagnosis(sessionID: number): Observable<Notes> {
    return this.http.get<Notes>(`${this.sessionUrl}/diagnosis/details/${sessionID}`);
  }

  updateSessionDiagnosis(notesID: number, notes: Notes): Observable<Notes> {
    return this.http.put<Notes>(`${this.sessionUrl}/diagnosis/update/${notesID}`, notes);
  }

  createSessionTreatment(sessionID: number, notes: Notes): Observable<Notes> {
    return this.http.post<Notes>(`${this.sessionUrl}/treatment/create/${sessionID}`, notes);
  }

  getSessionTreatment(sessionID: number): Observable<Notes> {
    return this.http.get<Notes>(`${this.sessionUrl}/treatment/details/${sessionID}`);
  }

  updateSessionTreatment(notesID: number, notes: Notes): Observable<Notes> {
    return this.http.put<Notes>(`${this.sessionUrl}/treatment/update/${notesID}`, notes);
  }

  createSessionRemarks(sessionID: number, notes: Notes): Observable<Notes> {
    return this.http.post<Notes>(`${this.sessionUrl}/remarks/create/${sessionID}`, notes);
  }

  getSessionRemarks(sessionID: number): Observable<Notes> {
    return this.http.get<Notes>(`${this.sessionUrl}/remarks/details/${sessionID}`);
  }

  updateSessionRemarks(notesID: number, notes: Notes): Observable<Notes> {
    return this.http.put<Notes>(`${this.sessionUrl}/remarks/update/${notesID}`, notes);
  }

  getComplaintsSuggestions(queryString: string): Observable<any> {
    return this.http.get(`${this.sessionUrl}/complaints/suggestions`, {params: {queryString: queryString}});
  }

  getPhysicalSuggestions(queryString: string): Observable<any> {
    return this.http.get(`${this.sessionUrl}/phyc-exams/suggestions`, {params: {queryString: queryString}});
  }

  getComorbiditiesSuggestions(queryString: string): Observable<any> {
    return this.http.get(`${this.sessionUrl}/comorbidities/suggestions`, {params: {queryString: queryString}});
  }

  getInvestigationsSuggestions(queryString: string): Observable<any> {
    return this.http.get(`${this.sessionUrl}/investigations/suggestions`, {params: {queryString: queryString}});
  }

  getDiagnosisSuggestions(queryString: string): Observable<any> {
    return this.http.get(`${this.sessionUrl}/diagnosis/suggestions`, {params: {queryString: queryString}});
  }

  getTreatmentSuggestions(queryString: string): Observable<any> {
    return this.http.get(`${this.sessionUrl}/treatment/suggestions`, {params: {queryString: queryString}});
  }

  getRemarksSuggestions(queryString: string): Observable<any> {
    return this.http.get(`${this.sessionUrl}/remarks/suggestions`, {params: {queryString: queryString}});
  }

  checkForOpenFollowUp(): Observable<Array<Session>> {
    return this.http.get<Array<Session>>(`${this.sessionUrl}/follow-up/open/list`);
  }

  getPreviousMergedSession(sessionID: number): Observable<Array<Session>> {
    return this.http.get<Array<Session>>(`${this.sessionUrl}/merged/previous/${sessionID}`);
  }

  getNextMergedSession(sessionID: number): Observable<Array<Session>> {
    return this.http.get<Array<Session>>(`${this.sessionUrl}/merged/next/${sessionID}`);
  }

}
