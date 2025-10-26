
import { SupabaseClient } from "@supabase/supabase-js";
import {boardService} from "@/lib/services/boardService";
import {columnService} from "@/lib/services/columnService";
import {taskService} from "@/lib/services/taskService";
export const boardDataService = {
    async createBoardWithDefaultColumns(supabase: SupabaseClient,
                                        boardData: {
                                            title: string;
                                            description?: string;
                                            color?: string;
                                            userId: string;
                                        }

    ) {
        const board = await boardService.createBoard( supabase,{
            title: boardData.title,
            description: boardData.description || null,
            color: boardData.color || "bg-blue-500",
            user_id: boardData.userId,
        });

        const defaultColumns = [
            { title: "To Do", sort_order: 0 },
            { title: "In Progress", sort_order: 1 },
            { title: "Review", sort_order: 2 },
            { title: "Done", sort_order: 3 },
        ];

        await Promise.all(
            defaultColumns.map((column) =>
                columnService.createColumn(supabase, {
                    ...column,
                    board_id: board.id,
                    user_id: boardData.userId,
                })
            )
        );

        return board;
    },
    async getBoardWithColumns(supabase: SupabaseClient, boardId: string) {
        const [board, columns] = await Promise.all([
            boardService.getBoard(supabase, boardId),
            columnService.getColumns(supabase, boardId),
        ]);

        if (!board) throw new Error("Board not found");
        const tasks = await taskService.getTasksByBoard(supabase, boardId);

        const columnsWithTasks = columns.map((column) => ({
            ...column,
            tasks: tasks.filter((task) => task.column_id === column.id),
        }));

        return {
            board,
            columnsWithTasks,
        };
    },
}