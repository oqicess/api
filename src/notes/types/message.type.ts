type Message = {
    id: string;
    title: string;
    text?: string;
    createdAt: number;
    updatedAt: number;
    color: string;
    expires?: number;
    tags?: string[];
    reminder: number;
};