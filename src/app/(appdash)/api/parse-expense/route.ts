import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { ExpenseCategory } from "@/firebase/schemas/expensecategories";

interface IParsedData {
  receipts: IReceipt[];
}

interface IReceipt {
  total: number;
  expenses: IExpense[];
}

interface IExpense {
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: string;
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json(
        { error: "No text content provided" },
        { status: 400 }
      );
    }

    // Optimized Groq prompt
    const prompt = `
You are a financial data extraction expert. Convert the following receipt text into a JSON object that matches the structure below.

RECEIPT TEXT:
${text}

JSON TEMPLATE:
{
  "receipts": [
    {
      "total": <number>,
      "expenses": [
        {
          "amount": <number>,
          "description": "<string>",
          "category": "<one of: ${Object.values(ExpenseCategory).join(" | ")}>",
          "date": "<ISO 8601 date string>"
        }
      ]
    }
  ]
}

RULES:
- Respond ONLY with a valid JSON object and nothing else.
- Output numbers as numerals (not strings).
- Convert all dates to ISO 8601 format.
- Use only the provided list for the category field.
- Do not include any markdown, explanations, or extra text.
`;

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a JSON output machine. Never add commentary.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "mixtral-8x7b-32768", // Fastest option
        // model: "llama3-70b-8192", // Most accurate
        temperature: 0,
        max_tokens: 1000,
        response_format: { type: "json_object" },
      });

      const jsonString = chatCompletion.choices[0].message.content;
      if (!jsonString) throw new Error("Empty response from Groq");

      // Clean and parse
      const cleanedJson = jsonString.replace(/```json|```/g, "").trim();
      const parsedData: IParsedData = JSON.parse(cleanedJson);
      console.log("Parsed data:", parsedData);

      // Manually validate the schema
      let validated = true;
      if (parsedData.receipts) {
        parsedData.receipts.forEach((receipt) => {
          if (typeof receipt.total !== "number") {
            validated = false;
          }
          receipt.expenses.forEach((expense) => {
            if (
              typeof expense.amount !== "number" ||
              typeof expense.description !== "string" ||
              !Object.values(ExpenseCategory).includes(
                expense.category as ExpenseCategory
              ) ||
              isNaN(Date.parse(expense.date))
            ) {
              validated = false;
            }
          });
        });
      } else {
        validated = false;
      }

      if (!validated) {
        console.error("Validation error");
        throw new Error("Invalid schema");
      }

      // Post-process categories
      parsedData.receipts = parsedData.receipts.map((receipt: IReceipt) => ({
        ...receipt,
        expenses: receipt.expenses.map((expense: IExpense) => ({
          ...expense,
          category: (
            expense.category as string
          ).toLowerCase() as ExpenseCategory,
        })),
      }));

      return NextResponse.json(parsedData, { status: 200 });
    } catch (error) {
      console.error("Groq API error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to process receipt";
      return NextResponse.json(
        {
          error: "Failed to process receipt",
          details: errorMessage,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Server error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
