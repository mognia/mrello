"use client";

import Image from "next/image";
import Navbar from "@/components/navbar";
import {useUser} from "@clerk/nextjs";
import { Plus } from "lucide-react";
import {useBoards} from "@/lib/hooks/useBoards";

export default function Home() {
    const {user} = useUser()
    const {createBoard} = useBoards()
    const handleCreateBoard = async () => {
        await createBoard({ title: "New Board" });

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

                <button className='w-full sm:w-auto' onClick={handleCreateBoard}>
                    <Plus className='h-4 w-4 mr-2'/>
                    Create Board
                </button>
            </div>
        </main>
      </div>
  );
}
