
export interface IPostFile {
    _id: number;
    item_number: string;
    csku: string;
    fsku: string;
}

export interface IPost {
    _id: number;
    item_number: string;
    csku: string;
    fsku: string;
    combined: boolean;
}

export interface ILog {
    _id: number;
    type: string;
    description: string;
    date: string;
}