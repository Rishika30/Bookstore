import { Schema, Types, model } from "mongoose";

export interface iBook{
    url: string;
    title: string;
    author: string;
    price: number;
    description: string;
    language: string;
}

const bookSchema = new Schema<iBook>({
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
},
{timestamps: true}
);

const bookModel = model<iBook>('books', bookSchema);
export default bookModel;