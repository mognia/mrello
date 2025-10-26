import React from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

type EditBoardDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    newTitle: string;
    setNewTitle: (v: string) => void;
    newColor: string;
    setNewColor: (v: string) => void;
    handleUpdateBoard: (e: React.FormEvent) => void;
    className?: string;
    titleText?: string;
};

export default function EditBoardDialog({
                                            open,
                                            onOpenChange,
                                            newTitle,
                                            setNewTitle,
                                            newColor,
                                            setNewColor,
                                            handleUpdateBoard,
                                            className = "w-[95vw] max-w-[425px] mx-auto",
                                            titleText = "Edit Board",
                                        }: EditBoardDialogProps) {
    const colors = [
        "bg-blue-500",
        "bg-green-500",
        "bg-yellow-500",
        "bg-red-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-indigo-500",
        "bg-gray-500",
        "bg-orange-500",
        "bg-teal-500",
        "bg-cyan-500",
        "bg-emerald-500",
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={className}>
                <DialogHeader>
                    <DialogTitle>{titleText}</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleUpdateBoard}>
                    <div className="space-y-2">
                        <Label htmlFor="boardTitle">Board Title</Label>
                        <Input
                            id="boardTitle"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Enter board title..."
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Board Color</Label>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {colors.map((color, key) => (
                                <button
                                    key={key}
                                    type="button"
                                    className={`w-8 h-8 rounded-full ${color} ${
                                        color === newColor ? "ring-2 ring-offset-2 ring-gray-900" : ""
                                    } `}
                                    onClick={() => setNewColor(color)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Save Changes</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}