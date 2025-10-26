"use client";

import Navbar from "@/components/navbar";
import {useUser} from "@clerk/nextjs";
import {useBoards} from "@/lib/hooks/useBoards";
import React, {useState} from "react";
import {Board} from "@/lib/supabase/models";
import StatsGrid from "@/app/dashboard/components/StatsGrid";
import BoardsList from "@/app/dashboard/components/BoardsList";
import FilterBoardsDialog from "@/app/dashboard/components/dialogs/FilterBoardsDialog";

export default function DashboardPage() {
    const {user} = useUser()
    const {createBoard, boards, loading, error} = useBoards()
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const [filters, setFilters] = useState({
        search: "",
        dateRange: {
            start: null as string | null,
            end: null as string | null,
        },
        taskCount: {
            min: null as number | null,
            max: null as number | null,
        },
    });

    const filteredBoards = boards.filter((board: Board) => {
        const matchesSearch = board.title
            .toLowerCase()
            .includes(filters.search.toLowerCase());

        const matchesDateRange =
            (!filters.dateRange.start ||
                new Date(board.created_at) >= new Date(filters.dateRange.start)) &&
            (!filters.dateRange.end ||
                new Date(board.created_at) <= new Date(filters.dateRange.end));

        return matchesSearch && matchesDateRange;
    });

    function clearFilters() {
        setFilters({
            search: "",
            dateRange: {
                start: null as string | null,
                end: null as string | null,
            },
            taskCount: {
                min: null as number | null,
                max: null as number | null,
            },
        });
        setIsFilterOpen(false)
    }

    const handleCreateBoard = async () => {
        await createBoard({title: "New Board"});

    }
    if (loading) {
        // return <div><Loader2/> Loading Your Boards....</div>
    }
    if (error) {
        return <div>
            <h2>Error Loading Boards</h2>
            <p>{error}</p>
        </div>
    }
    const filterCount = Object.values(filters).reduce((count, v) => {
        // Check for the simple string filter ('search')
        if (typeof v === 'string') {
            return count + (v !== "" ? 1 : 0);
        }

        // Check for nested object filters ('dateRange' and 'taskCount')
        if (typeof v === 'object' && v !== null) {
            // Count every individual property in the nested object that is NOT null
            const appliedNestedFilters = Object.values(v).filter(
                (nestedValue) => nestedValue !== null
            ).length;

            return count + appliedNestedFilters;
        }

        return count;
    }, 0);
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Navbar/>
            <main className='container mx-auto px-4 py-6 sm:py-8'>
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Welcome back,{" "}
                        {user?.firstName ?? user?.emailAddresses[0].emailAddress}! 👋
                    </h1>
                    <p className="text-gray-600">
                        Here&#39;s what&#39;s happening with your boards today.
                    </p>
                </div>
                <StatsGrid boards={boards}/>
                <BoardsList
                    boards={boards}
                    filteredBoards={filteredBoards}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    setFilters={setFilters}
                    setIsFilterOpen={setIsFilterOpen}
                    filterCount={filterCount}
                    handleCreateBoard={handleCreateBoard}
                />
            </main>
            {/* Filter Dialog */}
            <FilterBoardsDialog
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
                filters={filters}
                setFilters={setFilters}
                clearFilters={clearFilters}
            />
        </div>
    );
}
