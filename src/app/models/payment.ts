export interface Payment {
    id?: number,
    concept?: string;
    method?: string;
    mpesaCode?: string;
    amount?: string;
    balance?: string;
    companyName?: string;
    description?: string;
}