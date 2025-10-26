
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {DialogTrigger} from "@radix-ui/react-dialog";
import {MoreHorizontal, Plus} from "lucide-react";
import {Textarea} from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {ColumnWithTasks} from "@/lib/supabase/models";
import {Badge} from "@/components/ui/badge";
import { useDroppable} from "@dnd-kit/core";
import React from "react";

export default function DroppableColumn({column, children, onCreateTask, onEditColumn}: {
    column: ColumnWithTasks;
    children: React.ReactNode;
    onCreateTask: (taskData: React.FormEvent<HTMLFormElement>) => Promise<void>;
    onEditColumn: (column: ColumnWithTasks) => void;
}) {
    const {setNodeRef, isOver} = useDroppable({id: column.id});
    return (
        <div ref={setNodeRef}
             className={`w-full lg:flex-shrink-0 lg:w-80 ${
                 isOver ? "bg-blue-50 rounded-lg" : ""
             }`}>
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
                            onClick={() => onEditColumn(column)}
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