import { type NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";
import Report from "@/models/Report";

function requireAdmin(request: NextRequest) {
  const session = verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  return session?.role === "ADMIN" ? session : null;
}

export async function GET(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }
  await connectDB();

  const reports = await Report.find();

  return Response.json(reports);
}

export async function PATCH(req: NextRequest) {
  if (!requireAdmin(req)) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }
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

  const allReports = await Report.find();
  return NextResponse.json({
    success: true,
    message: "Report updated.",
    data: report,
    allReports,
  });
}

export async function POST(req: NextRequest) {
  try {
    const session = verifySession(req.cookies.get(SESSION_COOKIE)?.value);
    if (!session) {
      return NextResponse.json({ success: false, message: "Please sign in to submit a report." }, { status: 401 });
    }
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
      longitude,
      images,
    } = await req.json();

    const location = {
      type: "Point",
      coordinates: [longitude, latitude],
      address: `${address} ${zip} Landmark : ${landmark}`,
    };

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
    console.log("Existing :", existing);

    if (!existing) {
      const report = await Report.create({
        name,
        title,
        description,
        severity,
        images,
        location,
        reportedBy: session.userId,
      });

      return NextResponse.json(
        {
          success: true,
          message: "Report submitted successfully.",
          data: report,
        },
        { status: 201 },
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Report already reported.",
          data: existing,
        },
        { status: 409 },
      );
    }
  } catch (error) {
    console.log("Error :", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create report.",
        error,
      },
      { status: 500 },
    );
  }
}
