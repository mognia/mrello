// components/FilterDialog.tsx
import React from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";



type FilterDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    filters: any;
    handleFilterChange: ( type: "priority" | "assignee" | "dueDate",
                          value: string | string[] | null) => void;
    clearFilters: () => void;
    className?: string;
    title?: string;
    description?: string;
};

export default function FilterDialog({
                                         open,
                                         onOpenChange,
                                         filters,
                                         handleFilterChange,
                                         clearFilters,
                                         className = "w-[95vw] max-w-[425px] mx-auto",
                                         title = "Filter Tasks",
                                         description = "Filter tasks by priority, assignee, or due date",
                                     }: FilterDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={className}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <p className="text-sm text-gray-600">{description}</p>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Priority</Label>
                        <div className="flex flex-wrap gap-2">
                            {(["low", "medium", "high"] as string[]).map((priority, key) => (
                                <Button
                                    onClick={() => {
                                        const newPriorities = filters.priority.includes(priority)
                                            ? filters.priority.filter((p: string) => p !== priority)
                                            : [...filters.priority, priority];

                                        handleFilterChange("priority", newPriorities);
                                    }}
                                    key={key}
                                    variant={filters.priority.includes(priority) ? "default" : "outline"}
                                    size="sm"
                                >
                                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Due Date</Label>
                        <Input
                            type="date"
                            value={filters.dueDate || ""}
                            onChange={(e) => handleFilterChange("dueDate", e.target.value || null)}
                        />
                    </div>

                    <div className="flex justify-between pt-4">
                        <Button type="button" variant={"outline"} onClick={clearFilters}>
                            Clear Filters
                        </Button>
                        <Button type="button" onClick={() => onOpenChange(false)}>
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
