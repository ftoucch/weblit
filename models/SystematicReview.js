import mongoose from "mongoose";

const SystematicReviewSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, 'Please provide a title for the Systematic Literature Review'],
    },
    description: {
        type: String,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user'],
      },

},
{ timestamps: true }
)

export default mongoose.model('SystematicReviewScholar', SystematicReviewSchema)