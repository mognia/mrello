'use client'
import Navbar from "@/components/navbar";
import {useParams} from "next/navigation";
import {useBoard} from "@/lib/hooks/useBoards";

export default function BoardPage() {
    const {id} = useParams<{id:string}>();
    const {board} = useBoard(id);

    return (
        <div>
            <Navbar
                boardTitle={board?.title}

            />

        </div>
    )
}