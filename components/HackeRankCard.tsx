"use client";
import { hackerRankData } from "@/lib/data";

export default function HackerRankWidget() {
    const { username, stats } = hackerRankData;
    const totalSolved = stats.problemsSolved;
    const totalAvailable = stats.totalProblems || 3647; // sum of all categories

    const easyPercent = (stats.easy.solved / stats.easy.total) * 100;
    const mediumPercent = (stats.medium.solved / stats.medium.total) * 100;
    const hardPercent = (stats.hard.solved / stats.hard.total) * 100;
    const solvedPercent = (totalSolved / totalAvailable) * 100;

    return (
        <div className="bg-[#0f0f0f] text-white rounded-lg p-4 w-full max-w-[500px] border border-zinc-800">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <img
                        src="/hackerrank-logo.svg"
                        alt="HackerRank"
                        className="w-6 h-6"
                    />
                    <span className="text-lg font-bold">{username}</span>
                </div>
                <span className="text-[#73ff00] font-semibold">
                    #{stats.rank}
                </span>
            </div>

            {/* Circle Progress */}
            <div className="flex items-center gap-4 mb-4">
                <div className="relative w-16 h-16">
                    <svg className="transform -rotate-90" viewBox="0 0 36 36">
                        <path
                            d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#222"
                            strokeWidth="3"
                        />
                        <path
                            d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#ffbb33"
                            strokeWidth="3"
                            strokeDasharray={`${solvedPercent}, 100`}
                        />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                        {totalSolved}
                    </span>
                </div>

                <div className="flex-1">
                    {/* Easy */}
                    <div className="flex justify-between text-sm text-[#73ff00]">
                        <span>Easy</span>
                        <span>
                            {stats.easy.solved}/{stats.easy.total}
                        </span>
                    </div>
                    <div className="w-full h-1 bg-zinc-800">
                        <div
                            className="h-full bg-[#73ff00]"
                            style={{ width: `${easyPercent}%` }}
                        />
                    </div>

                    {/* Medium */}
                    <div className="flex justify-between text-sm text-[#73ff00] mt-2">
                        <span>Medium</span>
                        <span>
                            {stats.medium.solved}/{stats.medium.total}
                        </span>
                    </div>
                    <div className="w-full h-1 bg-zinc-800">
                        <div
                            className="h-full bg-[#ffbb33]"
                            style={{ width: `${mediumPercent}%` }}
                        />
                    </div>

                    {/* Hard */}
                    <div className="flex justify-between text-sm text-[#73ff00] mt-2">
                        <span>Hard</span>
                        <span>
                            {stats.hard.solved}/{stats.hard.total}
                        </span>
                    </div>
                    <div className="w-full h-1 bg-zinc-800">
                        <div
                            className="h-full bg-[#ff4444]"
                            style={{ width: `${hardPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="text-[10px] text-zinc-500 mt-2 flex justify-between">
                <span>2024.8.13</span>
                <span>2025.8.12</span>
            </div>
        </div>
    );
}
