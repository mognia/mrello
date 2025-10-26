
import React from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

type CreateColumnDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    newColumnTitle: string;
    setNewColumnTitle: (v: string) => void;
    handleCreateColumn: (e: React.FormEvent) => void;
    className?: string;
    titleText?: string;
    description?: string;
};

export default function CreateColumnDialog({
                                               open,
                                               onOpenChange,
                                               newColumnTitle,
                                               setNewColumnTitle,
                                               handleCreateColumn,
                                               className = "w-[95vw] max-w-[425px] mx-auto",
                                               titleText = "Create New Column",
                                               description = "Add new column to organize your tasks",
                                           }: CreateColumnDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={className}>
                <DialogHeader>
                    <DialogTitle>{titleText}</DialogTitle>
                    <p className="text-sm text-gray-600">{description}</p>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleCreateColumn}>
                    <div className="space-y-2">
                        <Label>Column Title</Label>
                        <Input
                            id="columnTitle"
                            value={newColumnTitle}
                            onChange={(e) => setNewColumnTitle(e.target.value)}
                            placeholder="Enter column title..."
                            required
                        />
                    </div>

                    <div className="space-x-2 flex justify-end">
                        <Button type="button" onClick={() => onOpenChange(false)} variant="outline">
                            Cancel
                        </Button>
                        <Button type="submit">Create Column</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
