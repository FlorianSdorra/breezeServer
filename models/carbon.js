import mongoose from 'mongoose';
const {Schema} = mongoose;

const carbonSchema = new Schema({
    value:{
        type: Number,
        required:true
    },
    time:{
        type: Date,
        required: true
    }
})

const Carbon = mongoose.model('Carbon', carbonSchema);

export default Carbon