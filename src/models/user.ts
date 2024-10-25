import {Schema, model, Types} from "mongoose";

export interface iUser{
    username: string;
    email: string;
    password: string;
    address: string;
    role: string;
    favourites?: Types.ObjectId[];
    cart?: Types.ObjectId[];
    order?: Types.ObjectId[];
}

const userSchema = new Schema<iUser>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    },
    favourites: [
        {
        type: Schema.Types.ObjectId,
        ref: 'books'
        },
    ],
    cart: [
        {
            type: Schema.Types.ObjectId,
            ref: 'books'
        },
    ],
    order: [
        {
            type: Schema.Types.ObjectId,
            ref: 'order'
        },
    ],
},
{timestamps: true}
);

const userModel = model<iUser>('user', userSchema);
export default userModel;