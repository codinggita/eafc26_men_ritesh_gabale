import mongoose from "mongoose";

export const LegalSectionSchema = new mongoose.Schema(
  {
    act_name: {
      type: String,
      required: true,
      index: true
    },
    act_short_name: {
      type: String,
      required: true,
      index: true
    },
    chapter: {
      type: String,
      required: false
    },
    chapter_title: {
      type: String,
      required: false
    },
    section: {
      type: String,
      required: true,
      index: true
    },
    section_title: {
      type: String,
      required: true
    },
    section_desc: {
      type: String,
      required: true
    },
    keywords: {
      type: [String],
      required: false,
      default: []
    },
    tags: {
      type: [String],
      required: false,
      default: []
    },
    related_sections: {
      type: [String],
      required: false,
      default: []
    },
    amendments: {
      type: [
        {
          year: Number,
          description: String
        }
      ],
      required: false,
      default: []
    },
    metadata: {
      source_file: {
        type: String,
        required: false
      },
      language: {
        type: String,
        default: "English"
      },
      version: {
        type: String,
        required: false
      }
    },
    state: String,
    court: String,
    status: {
      type: String,
      default: "active",
      index: true
    },
    category: String,
    punishment_type: String,
    bailable: Boolean,
    cognizable: Boolean,
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
      default: 0
    },
    bookmarkCount: {
      type: Number,
      default: 0
    },
    importance: {
      type: Number,
      default: 0
    },
    popularity: {
      type: Number,
      default: 0
    },
    history: {
      type: [
        {
          action: String,
          changed_at: {
            type: Date,
            default: Date.now
          },
          changes: mongoose.Schema.Types.Mixed
        }
      ],
      default: []
    },
    created_at: {
      type: Date,
      default: Date.now
    },
    updated_at: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: undefined,
    versionKey: false
  }
);

LegalSectionSchema.index({
  act_name: "text",
  act_short_name: "text",
  section: "text",
  section_title: "text",
  section_desc: "text",
  keywords: "text",
  tags: "text"
});

LegalSectionSchema.pre("save", function setUpdatedAt() {
  this.updated_at = new Date();
});
