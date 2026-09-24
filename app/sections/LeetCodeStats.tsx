import { getLeetCodeStats } from '@/lib/leetcode';
import LeetCodeArena from './LeetCodeArena';

const LeetCodeStats = async () => {
    const stats = await getLeetCodeStats();

    return <LeetCodeArena stats={stats} />;
};

export default LeetCodeStats;
