import { Task } from "./../supabase/models";
import { SupabaseClient } from "@supabase/supabase-js";
export const taskService = {
    async getTasksByBoard(
        supabase: SupabaseClient,
        boardId: string
    ): Promise<Task[]> {
        const { data, error } = await supabase
            .from("tasks")
            .select(
                `
        *,
        columns!inner(board_id)
        `
            )
            .eq("columns.board_id", boardId)
            .order("sort_order", { ascending: true });

        if (error) throw error;

        return data || [];
    },
    async createTask(
        supabase: SupabaseClient,
        task: Omit<Task, "id" | "created_at" | "updated_at">
    ): Promise<Task> {
        const { data, error } = await supabase
            .from("tasks")
            .insert(task)
            .select()
            .single();

        if (error) throw error;

        return data;
    },
    async moveTask(
        supabase: SupabaseClient,
        taskId: string,
        newColumnId: string,
        newOrder: number
    ) {
        const { data, error } = await supabase
            .from("tasks")
            .update({
                column_id: newColumnId,
                sort_order: newOrder,
            })
            .eq("id", taskId);

        if (error) throw error;
        return data;
    },
};