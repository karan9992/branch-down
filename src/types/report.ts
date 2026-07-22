export interface IReport {
    _id: string;
    name: string;
    title: string;
    description: string;
    severity: "LOW" | "MEDIUM" | "HIGH";
    status: "PENDING" | "VERIFIED" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
    images?: string[];
    location: {
        type: "Point";
        coordinates: [number, number];
        address: string;
    };
    //   reportedBy: string;
    createdAt: string;
    updatedAt: string;
}