import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
    chatAssistantId: {
        type: String,
        required: [true, 'please provide assistant ID']
    },
    threadId: {
        type: String,
        required: [true, 'please provide assistant ID']
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user'],
      },
    systematicReviewId: {
    type: mongoose.Types.ObjectId,
    ref: 'SystematicReview',
    required: [true, 'please provide the systematic review ID'],
    },
},
{ timestamps: true }
)

export default mongoose.model('Chat', ChatSchema);