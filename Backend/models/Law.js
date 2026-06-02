const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  action: {
    type: String,
    default: 'updated'
  },
  changes: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const lawSchema = new mongoose.Schema({
  act: { 
    type: String, 
    required: [true, 'Act name is required'],
    index: true // e.g., 'IPC', 'CPC', 'CrPC', 'MVA'
  },
  chapter: { 
    type: mongoose.Schema.Types.Mixed, 
    default: null 
  },
  chapter_title: { 
    type: String, 
    default: null 
  },
  section: { 
    type: String, 
    required: [true, 'Section number/string is required'],
    index: true // e.g., "1", "2A", "498A"
  },
  title: { 
    type: String, 
    required: [true, 'Section title is required'],
    index: true
  },
  description: { 
    type: String, 
    required: [true, 'Section description is required']
  },
  state: {
    type: String,
    default: null,
    index: true
  },
  court: {
    type: String,
    default: null,
    index: true
  },
  status: {
    type: String,
    default: 'active',
    index: true
  },
  category: {
    type: String,
    default: null,
    index: true
  },
  offenseCategory: {
    type: String,
    default: null,
    index: true
  },
  punishmentType: {
    type: String,
    default: null,
    index: true
  },
  punishment: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  bailable: {
    type: Boolean,
    default: null,
    index: true
  },
  cognizable: {
    type: Boolean,
    default: null,
    index: true
  },
  repealed: {
    type: Boolean,
    default: false,
    index: true
  },
  archived: {
    type: Boolean,
    default: false,
    index: true
  },
  views: {
    type: Number,
    default: 0,
    index: true
  },
  bookmarkCount: {
    type: Number,
    default: 0,
    index: true
  },
  importance: {
    type: Number,
    default: 0,
    index: true
  },
  popularity: {
    type: Number,
    default: 0,
    index: true
  },
  complexity: {
    type: String,
    default: null,
    index: true
  },
  summary: {
    type: String,
    default: null
  },
  updateHistory: {
    type: [historySchema],
    default: []
  }
}, { 
  timestamps: true,
  strict: false
});

lawSchema.index({
  act: 'text',
  section: 'text',
  title: 'text',
  description: 'text',
  category: 'text',
  offenseCategory: 'text'
});

module.exports = mongoose.model('Law', lawSchema);
