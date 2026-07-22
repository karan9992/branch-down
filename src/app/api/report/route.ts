import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Report from "@/models/Report";

export async function GET() {
    await connectDB();

    const reports = await Report.find();

    return Response.json(reports);
}

export async function POST(req: NextRequest) {

    try {
        await connectDB();

        const {
            title,
            description,
            severity,
            images,
            location,
        } = await req.json();

        const report = await Report.create({
            title,
            description,
            severity,
            images,
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
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: "Failed to create report.",
            },
            { status: 500 }
        );
    }
}