"use client";
import React, { useEffect, useState } from "react";
import { PenBox } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { toast } from "sonner";


// Local UI Components (replace with your own if needed)
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DialogHeader } from "@/components/ui/dialog"; // Ensure DialogHeader is imported correctly
import { Input } from "@/components/ui/input";

// --------------------------------------------------------
// Placeholder for your backend logic
// You can remove or replace these lines if you aren't using Drizzle or a local db config
// import { db } from "@/utils/dbConfig";
// import { Budgets } from "@/utils/schema";
// import { eq } from "drizzle-orm";
// --------------------------------------------------------

// Type for budget info (optional)
type BudgetInfo = {
    id: string;
    icon: string;
    name: string;
    amount: number;
};

interface EditBudgetProps {
    budgetInfo: BudgetInfo;
    refreshData: () => void; // Callback to refresh parent data
}

export default function EditBudget({ budgetInfo, refreshData }: EditBudgetProps) {
    const [emojiIcon, setEmojiIcon] = useState<string>(budgetInfo?.icon);
    const [openEmojiPicker, setOpenEmojiPicker] = useState<boolean>(false);
    const [name, setName] = useState<string | undefined>(budgetInfo?.name);
    const [amount, setAmount] = useState<number | undefined>(budgetInfo?.amount);



    // Keep form fields in sync with incoming props
    useEffect(() => {
        if (budgetInfo) {
            setEmojiIcon(budgetInfo.icon);
            setName(budgetInfo.name);
            setAmount(budgetInfo.amount);
        }
    }, [budgetInfo]);

    // This is where you'd do your actual DB or API call
    const onUpdateBudget = async () => {
        /* 
        backend commented out, replace with your own backend
        
        }
        */

        // Placeholder front-end only:
        console.log("Updated budget locally:", {
            name,
            amount,
            icon: emojiIcon,
        });

        // Simulate success
        refreshData();
        toast("Budget Updated (front-end only)!");
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex space-x-2 gap-2 rounded-full">
                    <PenBox className="w-4" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="">
                    <DialogTitle>Update Budget</DialogTitle>
                    <DialogDescription>
                        <div className="mt-5">
                            <Button
                                variant="outline"
                                className="text-lg"
                                onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                            >
                                {emojiIcon}
                            </Button>
                            {openEmojiPicker && (
                                <div className="absolute z-20">
                                    <EmojiPicker
                                        onEmojiClick={(e) => {
                                            setEmojiIcon(e.emoji);
                                            setOpenEmojiPicker(false);
                                        }}
                                    />
                                </div>
                            )}
                            <div className="mt-2">
                                <h2 className="text-black font-medium my-1">Budget Name</h2>
                                <Input
                                    placeholder="e.g. Home Decor"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="mt-2">
                                <h2 className="text-black font-medium my-1">Budget Amount</h2>
                                <Input
                                    type="number"
                                    value={amount}
                                    placeholder="e.g. 5000"
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button
                            disabled={!(name && amount)}
                            onClick={onUpdateBudget}
                            className="mt-5 w-full rounded-full"
                        >
                            Update Budget
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
