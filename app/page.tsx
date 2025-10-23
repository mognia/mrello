"use client";

import Image from "next/image";
import Navbar from "@/components/navbar";
import {useUser} from "@clerk/nextjs";
import {Filter, Grid3x3, List, Loader2, Plus, Rocket, Trello} from "lucide-react";
import {useBoards} from "@/lib/hooks/useBoards";
import {Card, CardContent} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {useState} from "react";

export default function Home() {
    const {user} = useUser()
    const {createBoard, boards,loading,error} = useBoards()
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    const handleCreateBoard = async () => {
        await createBoard({ title: "New Board" });

    }
    if (loading) {
        return <div><Loader2/> Loading Your Boards....</div>
    }
    if (error) {
        return <div>
            <h2>Error Loading Boards</h2>
            <p>{error}</p>
        </div>
    }
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navbar />
        <main className='container mx-auto px-4 py-6 sm:py-8'>
            <div className='mb-6 sm:mb-8'>
                <h1>Welcome back,
                    {user?.firstName ?? user?.emailAddresses[0].emailAddress}!
                </h1>
                <p className='text-gray-600'>
                    Here&#39;s what&#39;s happening with your boards today.
                </p>

            </div>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-600">
                                    Total Boards
                                </p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                                    {boards.length}
                                </p>
                            </div>
                            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Trello className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-600">
                                    Active Projects
                                </p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                                    {boards.length}
                                </p>
                            </div>
                            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Rocket className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-600">
                                    Recent Activity
                                </p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                                    {
                                        boards.filter((board) => {
                                            const updatedAt = new Date(board.updated_at);
                                            const oneWeekAgo = new Date();
                                            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                                            return updatedAt > oneWeekAgo;
                                        }).length
                                    }
                                </p>
                            </div>
                            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                📊
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-600">
                                    Total Boards
                                </p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">
                                    {boards.length}
                                </p>
                            </div>
                            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Trello className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Boards */}
            <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                            Your Boards
                        </h2>
                        <p className="text-gray-600">Manage your projects and tasks</p>

                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="flex items-center space-x-2 rounded bg-white border p-1">
                            <Button
                                variant={viewMode === "grid" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewMode("grid")}
                            >
                                <Grid3x3 />
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "default" : "ghost"}
                                size="sm"
                                onClick={() => setViewMode("list")}
                            >
                                <List />
                            </Button>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                        >
                            <Filter />
                            Filter
                        </Button>

                        <Button onClick={handleCreateBoard}>
                            <Plus />
                            Create Board
                        </Button>
                    </div>
                </div>
                </div>
        </main>
      </div>
  );
}
