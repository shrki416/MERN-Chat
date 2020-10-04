import { Schema, model } from 'mongoose';

const messageSchema = new Schema({
    content: String,
    name: String,
}, {
    timestamps: true,
});

export default model('Message', messageSchema)