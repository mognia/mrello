'use client'
import Navbar from "@/components/navbar";
import {useParams} from "next/navigation";
import {useBoard} from "@/lib/hooks/useBoards";
import React, {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {ColumnWithTasks, Task} from "@/lib/supabase/models";

import {
    DndContext,
    DragEndEvent,
    DragOverEvent, DragOverlay,
    DragStartEvent, PointerSensor,
    rectIntersection,
     useSensor,
    useSensors
} from "@dnd-kit/core";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import DroppableColumn from "@/app/boards/[id]/components/DroppableColumn";
import SortableTask from "@/app/boards/[id]/components/SortableTask";
import TaskOverlay from "@/app/boards/[id]/components/TaskOverlay";
import FilterDialog from "@/app/boards/[id]/components/dialogs/FilterDialog";
import EditBoardDialog from "@/app/boards/[id]/components/dialogs/EditBoardDialog";
import AddTaskDialog from "@/app/boards/[id]/components/dialogs/AddTaskDialog";
import CreateColumnDialog from "@/app/boards/[id]/components/dialogs/CreateColumnDialog";
import EditColumnDialog from "@/app/boards/[id]/components/dialogs/EditColumnDialog";

export default function BoardPage() {
    const {id} = useParams<{ id: string }>();
    const {board, updateBoard, columns, setColumns,createRealTask,moveTask,updateColumn,createColumn} = useBoard(id);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newColor, setNewColor] = useState("");
    const [isEditingColumn, setIsEditingColumn] = useState(false);
    const [newColumnTitle, setNewColumnTitle] = useState("");
    const [editingColumnTitle, setEditingColumnTitle] = useState("");
    const [editingColumn, setEditingColumn] = useState<ColumnWithTasks | null>(null);
    const [isCreatingColumn, setIsCreatingColumn] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);


    const [filters, setFilters] = useState({
        priority: [] as string[],
        assignee: [] as string[],
        dueDate: null as string | null,
    });

    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

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
        setIsFilterOpen(false);
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
    function handleDragStart(event: DragStartEvent) {
        const taskId = event.active.id as string;
        const task = columns
            .flatMap((col) => col.tasks)
            .find((task) => task.id === taskId);

        if (task) {
            setActiveTask(task);
        }
    }
    function handleDragOver(event: DragOverEvent) {
        // it updates UI
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const sourceColumn = columns.find((col) =>
            col.tasks.some((task) => task.id === activeId)
        );

        const targetColumn = columns.find((col) =>
            col.tasks.some((task) => task.id === overId)
        );

        if (!sourceColumn || !targetColumn) return;

        if (sourceColumn.id === targetColumn.id) {
            // in this case we know we are in a same column
            const activeIndex = sourceColumn.tasks.findIndex(
                (task) => task.id === activeId
            );

            const overIndex = targetColumn.tasks.findIndex(
                (task) => task.id === overId
            );

            if (activeIndex !== overIndex) {
                // in this case we know it's a different column
                setColumns((prev: ColumnWithTasks[]) => {
                    const newColumns = [...prev];
                    const column = newColumns.find((col) => col.id === sourceColumn.id);
                    if (column) {
                        const tasks = [...column.tasks];
                        const [removed] = tasks.splice(activeIndex, 1);
                        tasks.splice(overIndex, 0, removed);
                        column.tasks = tasks;
                    }
                    return newColumns;
                });
            }
        }
    }
    async function handleDragEnd(event: DragEndEvent) {
        // it updates Backend
        const { active, over } = event;
        if (!over) return;

        const taskId = active.id as string;
        const overId = over.id as string;

        const targetColumn = columns.find((col) => col.id === overId);
        if (targetColumn) {
            // check if were on different column
            const sourceColumn = columns.find((col) =>
                col.tasks.some((task) => task.id === taskId)
            );

            if (sourceColumn && sourceColumn.id !== targetColumn.id) {
                await moveTask(taskId, targetColumn.id, targetColumn.tasks.length);
            }
        } else {
            // check if were on same column
            const sourceColumn = columns.find((col) =>
                col.tasks.some((task) => task.id === taskId)
            );

            const targetColumn = columns.find((col) =>
                col.tasks.some((task) => task.id === overId)
            );

            if (sourceColumn && targetColumn) {
                const oldIndex = sourceColumn.tasks.findIndex(
                    (task) => task.id === taskId
                );

                const newIndex = targetColumn.tasks.findIndex(
                    (task) => task.id === overId
                );

                if (oldIndex !== newIndex) {
                    await moveTask(taskId, targetColumn.id, newIndex);
                }
            }
        }
    }
    function handleEditColumn(column: ColumnWithTasks) {
        setIsEditingColumn(true);
        setEditingColumn(column);
        setEditingColumnTitle(column.title);
    }
    async function handleCreateColumn(e: React.FormEvent) {
        e.preventDefault();

        if (!newColumnTitle.trim()) return;

        await createColumn(newColumnTitle.trim());

        //refresh input and close dialog after creating column
        setNewColumnTitle("");
        setIsCreatingColumn(false);
    }
    async function handleUpdateColumn(e: React.FormEvent) {
        e.preventDefault();

        if (!editingColumnTitle.trim() || !editingColumn) return;

        await updateColumn(editingColumn.id, editingColumnTitle.trim());

        setEditingColumnTitle("");
        setIsEditingColumn(false);
        setEditingColumn(null);
    }
    const filteredColumns = columns.map((column) => ({
        ...column,
        tasks: column.tasks.filter((task) => {
            // Filter by priority
            if (
                filters.priority.length > 0 &&
                !filters.priority.includes(task.priority)
            ) {
                return false;
            }

            // Filter by due date

            if (filters.dueDate && task.due_date) {
                const taskDate = new Date(task.due_date).toDateString();
                const filterDate = new Date(filters.dueDate).toDateString();

                if (taskDate !== filterDate) {
                    return false;
                }
            }

            return true;
        }),
    }));

    return (
        <>
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
                filterCount={Object.values(filters).reduce(
                    (count, v) =>
                        count + (Array.isArray(v) ? v.length : v !== null ? 1 : 0),
                    0
                )}
            />
            <EditBoardDialog
                open={isEditingTitle}
                onOpenChange={setIsEditingTitle}
                newTitle={newTitle}
                setNewTitle={setNewTitle}
                newColor={newColor}
                setNewColor={setNewColor}
                handleUpdateBoard={handleUpdateBoard}
            />

            <FilterDialog
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                filters={filters}
                handleFilterChange={handleFilterChange}
                clearFilters={clearFilters}
            />
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
                    <AddTaskDialog handleCreateTask={handleCreateTask} />
                </div>
                {/* Board Columns */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={rectIntersection}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}>
                    <div className="flex flex-col lg:flex-row lg:space-x-6 lg:overflow-x-auto
            lg:pb-6 lg:px-2 lg:-mx-2 lg:[&::-webkit-scrollbar]:h-2
            lg:[&::-webkit-scrollbar-track]:bg-gray-100
            lg:[&::-webkit-scrollbar-thumb]:bg-gray-300 lg:[&::-webkit-scrollbar-thumb]:rounded-full
            space-y-4 lg:space-y-0">
                        {filteredColumns.map((column, key) => (
                            <DroppableColumn column={column} key={key} onEditColumn={handleEditColumn} onCreateTask={handleCreateTask} >
                                <SortableContext items={column.tasks.map((task)=> task.id)} strategy={verticalListSortingStrategy}>

                                    <div className="space-y-3">
                                        {column.tasks.map((task, key) => (
                                            <div key={key}>
                                                <SortableTask task={task} key={key}/>
                                            </div>
                                        ))}
                                    </div>
                                </SortableContext>
                            </DroppableColumn>
                        ))}
                        <div className="w-full lg:flex-shrink-0 lg:w-80">
                            <Button
                                variant="outline"
                                className="w-full h-full min-h-[200px] border-dashed border-2 text-gray-500 hover:text-gray-700"
                                onClick={() => setIsCreatingColumn(true)}
                            >
                                <Plus />
                                Add another list
                            </Button>
                        </div>
                        <DragOverlay>
                            {activeTask ? <TaskOverlay task={activeTask}/> : null}
                        </DragOverlay>
                    </div>
                </DndContext>
            </main>
        </div>
            <CreateColumnDialog
                open={isCreatingColumn}
                onOpenChange={setIsCreatingColumn}
                newColumnTitle={newColumnTitle}
                setNewColumnTitle={setNewColumnTitle}
                handleCreateColumn={handleCreateColumn}
            />
            <EditColumnDialog
                open={isEditingColumn}
                onOpenChange={setIsEditingColumn}
                editingColumnTitle={editingColumnTitle}
                setEditingColumnTitle={setEditingColumnTitle}
                setEditingColumn={setEditingColumn}
                handleUpdateColumn={handleUpdateColumn}
            />
    </>
    )
}