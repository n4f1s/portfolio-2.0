export const LEETCODE_USERNAME = 'n4f1s';
export const LEETCODE_PROFILE_URL = `https://leetcode.com/u/${LEETCODE_USERNAME}/`;

const ENDPOINT = 'https://leetcode.com/graphql';
const REVALIDATE_SECONDS = 60 * 60 * 6;

export type DifficultyKey = 'easy' | 'medium' | 'hard';
export type TagTier = 'fundamental' | 'intermediate' | 'advanced';

export interface DifficultyStat {
    solved: number;
    total: number;
    acceptedSubmissions: number;
    submissions: number;
}

export interface CalendarYear {
    year: number;
    bestStreak: number;
    activeDays: number;
    /** unix seconds (UTC midnight) -> submission count */
    days: Record<string, number>;
}

export interface LeetCodeStatsData {
    username: string;
    ranking: number;
    solved: number;
    totalQuestions: number;
    acceptedSubmissions: number;
    submissions: number;
    difficulties: Record<DifficultyKey, DifficultyStat>;
    tags: Record<TagTier, { name: string; solved: number }[]>;
    languages: { name: string; solved: number }[];
    badges: { name: string; icon: string }[];
    calendar: CalendarYear[];
    isFallback: boolean;
}

type DifficultyCount = { difficulty: string; count: number; submissions: number };

interface ProfileResponse {
    allQuestionsCount: { difficulty: string; count: number }[];
    matchedUser: {
        username: string;
        profile: { ranking: number };
        submitStatsGlobal: { acSubmissionNum: DifficultyCount[] };
        submitStats: { totalSubmissionNum: DifficultyCount[] };
        userCalendar: { activeYears: number[] };
        badges: { displayName: string; icon: string }[];
        languageProblemCount: { languageName: string; problemsSolved: number }[];
        tagProblemCounts: Record<
            TagTier,
            { tagName: string; problemsSolved: number }[]
        >;
    } | null;
}

type CalendarResponse = Record<
    string,
    {
        userCalendar: {
            streak: number;
            totalActiveDays: number;
            submissionCalendar: string;
        };
    } | null
>;

const PROFILE_QUERY = `
query profile($username: String!) {
  allQuestionsCount { difficulty count }
  matchedUser(username: $username) {
    username
    profile { ranking }
    submitStatsGlobal { acSubmissionNum { difficulty count submissions } }
    submitStats { totalSubmissionNum { difficulty count submissions } }
    userCalendar { activeYears }
    badges { displayName icon }
    languageProblemCount { languageName problemsSolved }
    tagProblemCounts {
      advanced { tagName problemsSolved }
      intermediate { tagName problemsSolved }
      fundamental { tagName problemsSolved }
    }
  }
}`;

const calendarQuery = (years: number[]) => `
query calendar($username: String!) {
${years
    .map(
        (year) =>
            `  y${year}: matchedUser(username: $username) { userCalendar(year: ${year}) { streak totalActiveDays submissionCalendar } }`,
    )
    .join('\n')}
}`;

async function gql<T>(query: string): Promise<T> {
    const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Referer: 'https://leetcode.com',
            'User-Agent': 'Mozilla/5.0 (portfolio stats)',
        },
        body: JSON.stringify({
            query,
            variables: { username: LEETCODE_USERNAME },
        }),
        next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) throw new Error(`LeetCode responded with ${res.status}`);

    const json = (await res.json()) as { data?: T; errors?: unknown[] };
    if (!json.data || json.errors?.length) {
        throw new Error('LeetCode returned an invalid payload');
    }

    return json.data;
}

const byDifficulty = <T extends { difficulty: string }>(
    list: T[],
    difficulty: string,
) => list.find((item) => item.difficulty === difficulty);

const toIcon = (icon: string) =>
    icon.startsWith('http') ? icon : `https://leetcode.com${icon}`;

async function fetchLeetCodeStats(): Promise<LeetCodeStatsData> {
    const profile = await gql<ProfileResponse>(PROFILE_QUERY);
    const user = profile.matchedUser;
    if (!user) throw new Error('LeetCode user not found');

    const years = [...user.userCalendar.activeYears].sort((a, b) => b - a);
    const calendarData = years.length
        ? await gql<CalendarResponse>(calendarQuery(years))
        : {};

    const accepted = user.submitStatsGlobal.acSubmissionNum;
    const totals = user.submitStats.totalSubmissionNum;

    const difficulty = (name: string): DifficultyStat => ({
        solved: byDifficulty(accepted, name)?.count ?? 0,
        total: byDifficulty(profile.allQuestionsCount, name)?.count ?? 0,
        acceptedSubmissions: byDifficulty(accepted, name)?.submissions ?? 0,
        submissions: byDifficulty(totals, name)?.submissions ?? 0,
    });

    const sortTags = (list: { tagName: string; problemsSolved: number }[]) =>
        list
            .map((tag) => ({ name: tag.tagName, solved: tag.problemsSolved }))
            .sort((a, b) => b.solved - a.solved);

    return {
        username: user.username,
        ranking: user.profile.ranking,
        solved: byDifficulty(accepted, 'All')?.count ?? 0,
        totalQuestions: byDifficulty(profile.allQuestionsCount, 'All')?.count ?? 0,
        acceptedSubmissions: byDifficulty(accepted, 'All')?.submissions ?? 0,
        submissions: byDifficulty(totals, 'All')?.submissions ?? 0,
        difficulties: {
            easy: difficulty('Easy'),
            medium: difficulty('Medium'),
            hard: difficulty('Hard'),
        },
        tags: {
            fundamental: sortTags(user.tagProblemCounts.fundamental),
            intermediate: sortTags(user.tagProblemCounts.intermediate),
            advanced: sortTags(user.tagProblemCounts.advanced),
        },
        languages: user.languageProblemCount
            .map((lang) => ({ name: lang.languageName, solved: lang.problemsSolved }))
            .sort((a, b) => b.solved - a.solved),
        badges: user.badges.map((badge) => ({
            name: badge.displayName,
            icon: toIcon(badge.icon),
        })),
        calendar: years.flatMap((year) => {
            const entry = calendarData[`y${year}`]?.userCalendar;
            if (!entry) return [];
            return {
                year,
                bestStreak: entry.streak,
                activeDays: entry.totalActiveDays,
                days: JSON.parse(entry.submissionCalendar || '{}'),
            };
        }),
        isFallback: false,
    };
}

export async function getLeetCodeStats(): Promise<LeetCodeStatsData> {
    try {
        return await fetchLeetCodeStats();
    } catch (error) {
        console.error('[leetcode] falling back to snapshot:', error);
        return FALLBACK_STATS;
    }
}

/** Snapshot used when LeetCode is unreachable at build/revalidate time. */
const FALLBACK_STATS: LeetCodeStatsData = {
    username: LEETCODE_USERNAME,
    ranking: 524431,
    solved: 293,
    totalQuestions: 4060,
    acceptedSubmissions: 429,
    submissions: 618,
    difficulties: {
        easy: { solved: 188, total: 966, acceptedSubmissions: 287, submissions: 398 },
        medium: { solved: 95, total: 2117, acceptedSubmissions: 127, submissions: 195 },
        hard: { solved: 10, total: 977, acceptedSubmissions: 15, submissions: 25 },
    },
    tags: {
        fundamental: [
            { name: 'String', solved: 163 },
            { name: 'Array', solved: 137 },
            { name: 'Two Pointers', solved: 50 },
            { name: 'Sorting', solved: 37 },
            { name: 'Stack', solved: 20 },
            { name: 'Linked List', solved: 18 },
        ],
        intermediate: [
            { name: 'Hash Table', solved: 88 },
            { name: 'Binary Search', solved: 34 },
            { name: 'Math', solved: 27 },
            { name: 'Depth-First Search', solved: 18 },
            { name: 'Tree', solved: 17 },
            { name: 'Greedy', solved: 17 },
        ],
        advanced: [
            { name: 'Dynamic Programming', solved: 11 },
            { name: 'Trie', solved: 11 },
            { name: 'Divide and Conquer', solved: 9 },
            { name: 'Quickselect', solved: 3 },
            { name: 'Backtracking', solved: 2 },
            { name: 'Union-Find', solved: 2 },
        ],
    },
    languages: [
        { name: 'JavaScript', solved: 293 },
        { name: 'Python3', solved: 1 },
    ],
    badges: [
        {
            name: '50 Days Badge 2025',
            icon: 'https://assets.leetcode.com/static_assets/others/lg2550.png',
        },
    ],
    calendar: [],
    isFallback: true,
};
