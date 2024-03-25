import mongoose from 'mongoose';

const PrimaryStudySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the primary study'],
  },
  abstract: {
    type: String,
  },
  publicationType: {
    type: String,
    enum: ['Journal', 'Conference', 'Book', 'Thesis', 'Other'],
  },
  url: {
    type: String,
  },
  year: {
    type: Number,
  },
  citationCount: {
    type: Number,
    default: 0,
  },
  referenceCount: {
    type: Number,
    default: 0,
  },
  pdfLink: {
    type: String,
  },
});

const ResearchSchema = new mongoose.Schema(
  {
    researchTopic: {
      type: String,
      required: [true, 'Please enter research Topic'],
    },
    researchDescription: {
      type: String,
      required: [true, 'Please provide a short description'],
    },
    researchfield: {
      type: String,
      required: [true, 'Please provide research field'],
      maxlength: 100,
    },
    inclusionCriteria: {
      type: String,
      default: 'pending',
    },
    exclusionCriteria: {
      type: String,
    },
    primaryStudies: [PrimaryStudySchema],
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Research', ResearchSchema);
