import { Suspense } from "react";
import { WordsGame } from "@/components/words/WordsGame";

export default function WordsPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-green-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4" />
                        <p className="text-gray-600 font-bold">Loading...</p>
                    </div>
                </div>
            }
        >
            <WordsGame />
        </Suspense>
    );
}
