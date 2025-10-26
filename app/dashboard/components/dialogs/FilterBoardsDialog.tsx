import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React from "react";

type DateRange = { start: string | null; end: string | null };

type Filters = {
    search: string;
    dateRange: DateRange;
    [key: string]: any;
};

type FilterBoardsDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    filters: Filters;
    setFilters: any;
    clearFilters: () => void;
    className?: string;
    titleText?: string;
    description?: string;
};

export default function FilterBoardsDialog({
                                               open,
                                               onOpenChange,
                                               filters,
                                               setFilters,
                                               clearFilters,
                                               className = "w-[95vw] max-w-[425px] mx-auto",
                                               titleText = "Filter Boards",
                                               description = "Filter boards by title, date, or task count.",
                                           }: FilterBoardsDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={className}>
                <DialogHeader>
                    <DialogTitle>{titleText}</DialogTitle>
                    <p className="text-sm text-gray-600">{description}</p>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Search</Label>
                        <Input
                            id="search"
                            placeholder="Search board titles..."
                            value={filters.search}
                            onChange={(e) =>
                                setFilters((prev:any) => ({ ...prev, search: e.target.value }))
                            }
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Date Range</Label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div>
                                <Label className="text-xs">Start Date</Label>
                                <Input
                                    type="date"
                                    value={filters.dateRange.start || ""}
                                    onChange={(e) =>
                                        setFilters((prev:any) => ({
                                            ...prev,
                                            dateRange: {
                                                ...prev.dateRange,
                                                start: e.target.value || null,
                                            },
                                        }))
                                    }
                                />
                            </div>
                            <div>
                                <Label className="text-xs">End Date</Label>
                                <Input
                                    type="date"
                                    value={filters.dateRange.end || ""}
                                    onChange={(e) =>
                                        setFilters((prev:any) => ({
                                            ...prev,
                                            dateRange: {
                                                ...prev.dateRange,
                                                end: e.target.value || null,
                                            },
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between pt-4 space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button variant="outline" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                        <Button onClick={() => onOpenChange(false)}>Apply Filters</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
