"use client"
import {boardDataService} from "@/lib/service";
import { useUser } from "@clerk/nextjs";
import {useState} from "react";
import {Board} from "@/lib/supabase/models";
import {useSupabase} from "@/lib/supabase/SupabaseProvider";
export function useBoards() {
    const { user } = useUser();
    const { supabase } = useSupabase();
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function createBoard(boardData: {
        title: string;
        description?: string;
        color?: string;
    }) {
        if (!user) throw new Error("User not authenticated");

        try {
            const newBoard = await boardDataService.createBoardWithDefaultColumns(
                supabase!,  {
                    ...boardData,
                    userId: user.id,
                }
            );
            setBoards((prev) => [newBoard, ...prev]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create board.");
        }
    }
    return {boards, loading, error, createBoard};
}