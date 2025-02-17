import { createReceipt } from "@/firebase/helpers/createReceipt";
import { getReceiptsByUser } from "@/firebase/helpers/getReceipts";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const clerkId = searchParams.get("clerkId");

        if (!clerkId) {
            return NextResponse.json(
                { error: "clerkId query parameter is required" },
                { status: 400 }
            );
        }

        const receipts = await getReceiptsByUser(clerkId);

        return NextResponse.json(receipts);
    } catch (error: any) {
        console.error("Error getting expenses:", error);
        return NextResponse.json(
            { error: error.message || "Failed to get expenses" },
            { status: 500 }
        );
        
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.clerkId) {
            return NextResponse.json(
                { error: "clerkId is required" },
                { status: 400 }
            );
        }

        const receiptData = {
            userId: body.clerkId,
            total: parseFloat(body.total),
            expenses: body.expenses,
            receiptImageURL: body.receiptImageURL
        };

        // Save the receipt to the database
        await createReceipt(receiptData);

        return NextResponse.json(receiptData);
    } catch (error: any) {
        console.error("Error creating receipt:", error);
        return NextResponse.json(
            { error: error.message || "Failed to create receipt" },
            { status: 500 }
        );
    }
}