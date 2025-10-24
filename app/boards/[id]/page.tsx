'use client'
import Navbar from "@/components/navbar";
import {useParams} from "next/navigation";
import {useBoard} from "@/lib/hooks/useBoards";
import {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {DialogTrigger} from "@radix-ui/react-dialog";
import {Calendar, MoreHorizontal, Plus, User} from "lucide-react";
import {Textarea} from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {ColumnWithTasks, Task as TaskType} from "@/lib/supabase/models";
import {a} from "@clerk/shared/clerkApiResponseError-CpTaa-eQ";
import {Badge} from "@/components/ui/badge";
import {Card, CardContent} from "@/components/ui/card";

function Column({column, children, onCreateTask, onEditTask}: {
    column: ColumnWithTasks;
    children: React.ReactNode;
    onCreateTask: (taskData: a) => Promise<void>;
    onEditTask: (column: ColumnWithTasks) => void;
}) {

    return (
        <div>
            <div className={`bg-white rounded-lg shadow-sm border`}>
                {/*    column Header*/}
                <div className="p-3 sm:p-4 border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                {column.title}
                            </h3>
                            <Badge variant="secondary" className="text-xs flex-shrink-0">
                                {column.tasks.length}
                            </Badge>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex-shrink-0"

                        >
                            <MoreHorizontal/>
                        </Button>
                    </div>
                </div>
                {/* column content */}
                <div className={'pt-2'}>{children}</div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost"
                                className="w-full mt-3 text-gray-500 hover:text-gray-700 cursor-pointer">
                            <Plus/>
                            Add Task
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
                        <DialogHeader>
                            <DialogTitle>Create New Task</DialogTitle>
                            <p className="text-sm text-gray-600">
                                Add a task to the board
                            </p>
                        </DialogHeader>

                        <form className="space-y-4" onSubmit={onCreateTask}>
                            <div className="space-y-2">
                                <Label>Title *</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    placeholder="Enter task title"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Enter task description"
                                    rows={3}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Assignee</Label>
                                <Input
                                    id="assignee"
                                    name="assignee"
                                    placeholder="Who should do this?"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Priority</Label>
                                <Select name="priority" defaultValue="medium">
                                    <SelectTrigger>
                                        <SelectValue/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {["low", "medium", "high"].map((priority, key) => (
                                            <SelectItem key={key} value={priority}>
                                                {priority.charAt(0).toUpperCase() +
                                                    priority.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Due Date</Label>
                                <Input type="date" id="dueDate" name="dueDate"/>
                            </div>

                            <div className="flex justify-end space-x-2 pt-4">
                                <Button type="submit">Create Task</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}

function Task({task}: { task: TaskType }) {

    function getPriorityColor(priority: "low" | "medium" | "high"): string {
        switch (priority) {
            case "high":
                return "bg-red-500";
            case "medium":
                return "bg-yellow-500";
            case "low":
                return "bg-green-500";
            default:
                return "bg-yellow-500";
        }
    }

    return (
        <div>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-3 sm:p-4">
                    <div className="space-y-2 sm:space-y-3">
                        {/* Task Header */}
                        <div className="flex items-start justify-between">
                            <h4 className="font-medium text-gray-900 text-sm leading-tight flex-1 min-w-0 pr-2">
                                {task.title}
                            </h4>
                        </div>

                        {/* Task Description */}
                        <p className="text-xs text-gray-600 line-clamp-2">
                            {task.description || "No description."}
                        </p>

                        {/* Task Meta */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                                {task.assignee && (
                                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                                        <User className="h-3 w-3"/>
                                        <span className="truncate">{task.assignee}</span>
                                    </div>
                                )}
                                {task.due_date && (
                                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                                        <Calendar className="h-3 w-3"/>
                                        <span className="truncate">{task.due_date}</span>
                                    </div>
                                )}
                            </div>
                            <div
                                className={`w-2 h-2 rounded-full flex-shrink-0 ${getPriorityColor(
                                    task.priority
                                )}`}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function BoardPage() {
    const {id} = useParams<{ id: string }>();
    const {board, updateBoard, columns, createRealTask} = useBoard(id);
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
        } catch {
        }
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

    async function createTask(taskData: {
        title: string;
        description?: string;
        assignee?: string;
        dueDate?: string;
        priority: "low" | "medium" | "high";
    }) {
        const targetColumn = columns[0];
        if (!targetColumn) {
            throw new Error("No column available to add task");
        }

        await createRealTask(targetColumn.id, taskData);
    }

    async function handleCreateTask(e: any) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const taskData = {
            title: formData.get("title") as string,
            description: (formData.get("description") as string) || undefined,
            assignee: (formData.get("assignee") as string) || undefined,
            dueDate: (formData.get("dueDate") as string) || undefined,
            priority:
                (formData.get("priority") as "low" | "medium" | "high") || "medium",
        };

        if (taskData.title.trim()) {
            await createTask(taskData);

            const trigger = document.querySelector(
                '[data-state="open"]'
            ) as HTMLElement;
            if (trigger) trigger.click();
        }
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
                onFilterClick={() => {
                    setIsFilterOpen(true);
                }}
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

            {/* Board Content */}
            <main className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
                {/* Stats */}
                <div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">Total Tasks: </span>
                            {columns.reduce((sum, col) => sum + col.tasks.length, 0)}
                        </div>
                    </div>
                    {/* Add task dialog */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto">
                                <Plus/>
                                Add Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
                            <DialogHeader>
                                <DialogTitle>Create New Task</DialogTitle>
                                <p className="text-sm text-gray-600">
                                    Add a task to the board
                                </p>
                            </DialogHeader>

                            <form className="space-y-4" onSubmit={handleCreateTask}>
                                <div className="space-y-2">
                                    <Label>Title *</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        placeholder="Enter task title"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Enter task description"
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Assignee</Label>
                                    <Input
                                        id="assignee"
                                        name="assignee"
                                        placeholder="Who should do this?"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Priority</Label>
                                    <Select name="priority" defaultValue="medium">
                                        <SelectTrigger>
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {["low", "medium", "high"].map((priority, key) => (
                                                <SelectItem key={key} value={priority}>
                                                    {priority.charAt(0).toUpperCase() +
                                                        priority.slice(1)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Due Date</Label>
                                    <Input type="date" id="dueDate" name="dueDate"/>
                                </div>

                                <div className="flex justify-end space-x-2 pt-4">
                                    <Button type="submit">Create Task</Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                {/* Board Columns */}
                <div className="flex flex-col lg:flex-row lg:space-x-6 lg:overflow-x-auto
            lg:pb-6 lg:px-2 lg:-mx-2 lg:[&::-webkit-scrollbar]:h-2
            lg:[&::-webkit-scrollbar-track]:bg-gray-100
            lg:[&::-webkit-scrollbar-thumb]:bg-gray-300 lg:[&::-webkit-scrollbar-thumb]:rounded-full
            space-y-4 lg:space-y-0">
                    {columns.map((column, key) => (
                        <Column column={column} key={key} onEditTask={() => {
                        }} onCreateTask={handleCreateTask}>
                            <div className="space-y-3">
                                {column.tasks.map((task, key) => (
                                    <div key={key}>
                                        <Task task={task} key={key}/>
                                    </div>
                                ))}
                            </div>
                        </Column>
                    ))}
                </div>
            </main>
        </div>
    )
}