import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Report from "@/models/Report";

export async function GET() {
    await connectDB();

    const reports = await Report.find();

    return Response.json(reports);
}

export async function PATCH(req: NextRequest) {
    await connectDB();

    const { id, status } = await req.json();

    const report = await Report.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true, runValidators: true },
    );

    if (!report) {
        return NextResponse.json(
            { success: false, message: "Report not found." },
            { status: 404 },
        );
    }

    const allReports = await Report.find()
    return NextResponse.json({
        success: true,
        message: "Report updated.",
        data: report,
        allReports
    });
}

export async function POST(req: NextRequest) {

    try {
        await connectDB();

        const {
            name,
            title,
            description,
            severity,
            address,
            landmark,
            zip,
            latitude,
            longitude
        } = await req.json();

        const location = {
            type: "Point",
            coordinates: [longitude, latitude],
            address: `${address} ${zip} Landmark : ${landmark}`,
        }

        const existing = await Report.findOne({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 30,
                },
            },
        });
        console.log("Existing :", existing)

        if (!existing) {

            const report = await Report.create({
                name,
                title,
                description,
                severity,
                location,
            });

            return NextResponse.json(
                {
                    success: true,
                    message: "Report submitted successfully.",
                    data: report,
                },
                { status: 201 }
            );

        } else {

            return NextResponse.json(
                {
                    success: false,
                    message: "Report already reported.",
                    data: existing,
                },
                { status: 409 }
            );
        }






    } catch (error) {
        console.log("Error :", error)
        return NextResponse.json(
            {
                success: false,
                message: "Failed to create report.",
                error
            },
            { status: 500 }
        );
    }
}