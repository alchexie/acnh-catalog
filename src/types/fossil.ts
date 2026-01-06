export interface Fossil {
    name: string;
    parts: {
        id: number;
        name: string;
        image: string;
        sell: number;
    }[];
    desc: string;
}