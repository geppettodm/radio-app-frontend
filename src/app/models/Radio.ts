export interface Radio {
    _id?: string;
    name: string;
    city?: string;
    geo?: [number, number];
    country?: string;
    conn?: string;
    image?:string;
    buffering?:boolean;
}