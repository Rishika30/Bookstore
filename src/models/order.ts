import {Schema, Types, model} from 'mongoose';

export interface iOrder {
    user: Types.ObjectId;
    books: Types.ObjectId[];
    status: string;
}

const orderSchema = new Schema<iOrder>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    books: [
        {
        type: Schema.Types.ObjectId,
        ref: 'books'
        },
    ],
    status: {
        type: String,
        default: 'Order Placed',
        enum: ['Order Placed', 'Out for Delivery', 'Delivered', 'Cancelled']
    },
}, 
{timestamps: true}
);

const orderModel = model<iOrder>('order', orderSchema);
export default orderModel;