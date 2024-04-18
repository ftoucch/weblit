import mongoose from 'mongoose';

const AuthorSchema = new mongoose.Schema(
  {
    authorId: {
      type: String,
    },
    name: {
      type: String,
    },
  },
  { _id: false }
);

const PrimaryStudySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'please provide title'],
  },
  abstract: {
    type: String,
  },
  authors: [AuthorSchema],
  referenceCount: {
    type: Number,
  },
  referenceCount: {
    type: Number,
  },
  citationCount: {
    type: Number,
  },
  year: {
    type: Number,
  },
  openAccessPdf: {
    type: Object,
  },
  filterQuery: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'FilterQuery',
    },
  ],
  systematicReviewId: {
    type: mongoose.Types.ObjectId,
    ref: 'SystematicReview',
    required: [true, 'please provide the systematic review ID'],
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'please provide the user ID'],
  },
});

export default mongoose.model('PrimaryStudy', PrimaryStudySchema);
