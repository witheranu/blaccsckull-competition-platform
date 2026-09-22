const mongoose = require('mongoose');
const { Schema } = mongoose;

const competitionSchema = new Schema({
  slug: { type: String, unique: true, required: true, index: true },
  title: String, category: String, format: String, certificate: Boolean,
  prizePool: Number, entryFee: Number, capacity: { type: Number, min: 1 }, bookedCount: { type: Number, default: 0, min: 0 }, registeredUserIds: { type: [String], default: [] },
  judge: { name: String, title: String, experience: String, avatar: String, introVideoUrl: String },
  registrationClosesAt: Date, submissionStartsAt: Date, submissionEndsAt: Date, resultAt: Date,
  description: String, judgingParameters: [String], rules: [String],
  rewards: [{ place: String, amount: Number }],
  previousWinners: [{ name: String, place: String, image: String, videoUrl: String }]
}, { timestamps: true });

const registrationSchema = new Schema({
  competition: { type: Schema.Types.ObjectId, ref: 'Competition', required: true },
  userId: { type: String, required: true }, status: { type: String, enum: ['registered', 'cancelled'], default: 'registered' }
}, { timestamps: true });
registrationSchema.index({ competition: 1, userId: 1 }, { unique: true });

const submissionSchema = new Schema({ competition: { type: Schema.Types.ObjectId, ref: 'Competition' }, userId: String, mediaUrl: String }, { timestamps: true });
submissionSchema.index({ competition: 1, userId: 1 }, { unique: true });
module.exports = { Competition: mongoose.model('Competition', competitionSchema), Registration: mongoose.model('Registration', registrationSchema), Submission: mongoose.model('Submission', submissionSchema) };
