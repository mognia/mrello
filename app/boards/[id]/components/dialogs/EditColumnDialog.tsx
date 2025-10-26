import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React from "react";

type EditColumnDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingColumnTitle: string;
    setEditingColumnTitle: (v: string) => void;
    setEditingColumn: (v: any) => void;
    handleUpdateColumn: (e: React.FormEvent) => void;
    className?: string;
    titleText?: string;
    description?: string;
};

export default function EditColumnDialog({
                                             open,
                                             onOpenChange,
                                             editingColumnTitle,
                                             setEditingColumnTitle,
                                             setEditingColumn,
                                             handleUpdateColumn,
                                             className = "w-[95vw] max-w-[425px] mx-auto",
                                             titleText = "Edit Column",
                                             description = "Update the title of your column",
                                         }: EditColumnDialogProps) {
    const handleCancel = () => {
        onOpenChange(false);
        setEditingColumnTitle("");
        setEditingColumn(null);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={className}>
                <DialogHeader>
                    <DialogTitle>{titleText}</DialogTitle>
                    <p className="text-sm text-gray-600">{description}</p>
                </DialogHeader>

                <form className="space-y-4" onSubmit={handleUpdateColumn}>
                    <div className="space-y-2">
                        <Label>Column Title</Label>
                        <Input
                            id="columnTitle"
                            value={editingColumnTitle}
                            onChange={(e) => setEditingColumnTitle(e.target.value)}
                            placeholder="Enter column title..."
                            required
                        />
                    </div>

                    <div className="space-x-2 flex justify-end">
                        <Button type="button" onClick={handleCancel} variant="outline">
                            Cancel
                        </Button>
                        <Button type="submit">Edit Column</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
