import mongoose from 'mongoose';

const PrimaryStudySchema = new mongoose.Schema({
  title : {
      type: String,
      required: [true, 'please provide title']
    },
  abstract : {
    type: String,
  },
  author : [{
    type: String
  }],
  filterQuery: [{
    type: mongoose.Types.ObjectId,
    ref: 'FilterQuery'
  }],
  systematicReviewId : {
    type: mongoose.Types.ObjectId,
    ref: 'SystematicReview',
    required: [true, 'please provide the systematic review ID']
  },
  user : {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'please provide the user ID']
  }

});

export default mongoose.model('PrimaryStudy', PrimaryStudySchema);
