import mongoose from "mongoose";

const FilterQuerySchema = new mongoose.Schema({
researchQuestion : {
    type: String,
    required: [true, 'please provide research question']
},
inclusionCriteria : {
    type: String,
    required: [true, 'please provide inclusion criteria']
},
exclusionCriteria : {
    type: String,
    required: [true, 'please provide exclusion criteria'],    
},
searchString : {
    type: String,
    required: [true, 'please provide a search string']
},
systematicReviewId : {
    type: mongoose.Types.ObjectId,
    ref: 'SystematicReview',
    required: [true, 'please provide the systematic review ID']
}
},
{ timestamps: true }
)

export default mongoose.model('FilterQuery', FilterQuerySchema)