import mongoose, { Schema, model, models } from "mongoose";

const ReportSchema = new Schema(
    {
        name: String,
        title: String,

        description: String,

        // images: [String],

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },

            coordinates: {
                type: [Number],
                required: true,
            },

            address: String,
        },

        severity: {
            type: String,
            enum: ["LOW", "MEDIUM", "HIGH"],
            default: "MEDIUM",
        },

        status: {
            type: String,
            enum: [
                "PENDING",
                "VERIFIED",
                "IN_PROGRESS",
                "RESOLVED",
                "REJECTED",
            ],
            default: "PENDING",
        },

        // reportedBy: {
        //     type: Schema.Types.ObjectId,
        //     ref: "User",
        //     required: true,
        // },
    },
    {
        timestamps: true,
    }
);

ReportSchema.index({
    location: "2dsphere",
});

export default models.Report || model("Report", ReportSchema);