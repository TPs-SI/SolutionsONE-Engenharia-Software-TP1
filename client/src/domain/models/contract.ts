export interface Contract {
    id: number;
    title: string;
    nameClient: string;
    value: number;
    date: string;
    archivePath: string;
    client?: string; // se for opcional 
}