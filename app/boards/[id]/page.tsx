'use client'
import Navbar from "@/components/navbar";
import {useParams} from "next/navigation";
import {useBoard} from "@/lib/hooks/useBoards";
import {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export default function BoardPage() {
    const {id} = useParams<{id:string}>();
    const {board,updateBoard} = useBoard(id);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newColor, setNewColor] = useState("");

    const [isFilterOpen, setIsFilterOpen] = useState(false);


    const [filters, setFilters] = useState({
        priority: [] as string[],
        assignee: [] as string[],
        dueDate: null as string | null,
    });
    async function handleUpdateBoard(e: React.FormEvent) {
        e.preventDefault();

        if (!newTitle.trim() || !board) return;

        try {
            await updateBoard(board.id, {
                title: newTitle.trim(),
                color: newColor || board.color,
            });
            setIsEditingTitle(false);
        } catch {}
    }

    function handleFilterChange(
        type: "priority" | "assignee" | "dueDate",
        value: string | string[] | null
    ) {
        setFilters((prev) => ({
            ...prev,
            [type]: value,
        }));
    }

    function clearFilters() {
        setFilters({
            priority: [] as string[],
            assignee: [] as string[],
            dueDate: null as string | null,
        });
    }
    return (
        <div>
            <Navbar
                boardTitle={board?.title}
                onEditBoard={() => {
                    setNewTitle(board?.title ?? "");
                    setNewColor(board?.color ?? "");
                    setIsEditingTitle(true);
                }}
                onFilterClick={() => {setIsFilterOpen(true);}}
                filterCount={2}
            />
            <Dialog open={isEditingTitle} onOpenChange={setIsEditingTitle}>
                <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Board</DialogTitle>
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
                                {[
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
                                ].map((color, key) => (
                                    <button
                                        key={key}
                                        type="button"
                                        className={`w-8 h-8 rounded-full ${color} ${
                                            color === newColor
                                                ? "ring-2 ring-offset-2 ring-gray-900"
                                                : ""
                                        } `}
                                        onClick={() => setNewColor(color)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditingTitle(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
                    <DialogHeader>
                        <DialogTitle>Filter Tasks</DialogTitle>
                        <p className="text-sm text-gray-600">
                            Filter tasks by priority, assignee, or due date
                        </p>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <div className="flex flex-wrap gap-2">
                                {["low", "medium", "high"].map((priority, key) => (
                                    <Button
                                        onClick={() => {
                                            const newPriorities = filters.priority.includes(
                                                priority
                                            )
                                                ? filters.priority.filter((p) => p !== priority)
                                                : [...filters.priority, priority];

                                            handleFilterChange("priority", newPriorities);
                                        }}
                                        key={key}
                                        variant={
                                            filters.priority.includes(priority)
                                                ? "default"
                                                : "outline"
                                        }
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
                                onChange={(e) =>
                                    handleFilterChange("dueDate", e.target.value || null)
                                }
                            />
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button
                                type="button"
                                variant={"outline"}
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </Button>
                            <Button type="button" onClick={() => setIsFilterOpen(false)}>
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}