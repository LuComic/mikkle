export type GameResult = 'win' | 'loss';

export interface TodayStatus {
	playedToday: boolean;
	result?: GameResult;
	guessedName?: string;
	resetAt: number; // epoch ms
}

const GUESSED_KEY = 'mikkle_guessed_names';
const TODAY_KEY = 'mikkle_today';

function isBrowser(): boolean {
	return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function getNextLocalMidnightEpochMs(from: number = Date.now()): number {
	const d = new Date(from);
	d.setHours(24, 0, 0, 0); // next local midnight
	return d.getTime();
}

function todayString(): string {
	const d = new Date();
	// YYYY-MM-DD in local time
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, '0');
	const day = String(d.getDate()).padStart(2, '0');
	return `${y}-${m}-${day}`;
}

export function listGuessedNames(): string[] {
	if (!isBrowser()) return [];
	try {
		const raw = localStorage.getItem(GUESSED_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
	} catch {
		return [];
	}
}

export function addGuessedName(name: string): void {
	if (!isBrowser()) return;
	const current = new Set(listGuessedNames());
	current.add(name);
	localStorage.setItem(GUESSED_KEY, JSON.stringify(Array.from(current)));
}

export function clearGuessedNames(): void {
	if (!isBrowser()) return;
	localStorage.removeItem(GUESSED_KEY);
}

export function getTodayStatus(): TodayStatus {
	const empty: TodayStatus = { playedToday: false, resetAt: getNextLocalMidnightEpochMs() };
	if (!isBrowser()) return empty;
	try {
		const raw = localStorage.getItem(TODAY_KEY);
		if (!raw) return empty;
		const parsed = JSON.parse(raw) as {
			date: string;
			result?: GameResult;
			guessedName?: string;
			resetAt: number;
		} | null;
		if (!parsed) return empty;
		// If expired or different day, clear it
		if (!parsed.resetAt || Date.now() >= parsed.resetAt || parsed.date !== todayString()) {
			localStorage.removeItem(TODAY_KEY);
			return empty;
		}
		return {
			playedToday: true,
			result: parsed.result,
			guessedName: parsed.guessedName,
			resetAt: parsed.resetAt
		};
	} catch {
		return empty;
	}
}

export function markWin(guessedName: string): void {
	if (!isBrowser()) return;
	addGuessedName(guessedName);
	const payload = {
		date: todayString(),
		result: 'win' as GameResult,
		guessedName,
		resetAt: getNextLocalMidnightEpochMs()
	};
	localStorage.setItem(TODAY_KEY, JSON.stringify(payload));
}

export function markLoss(): void {
	if (!isBrowser()) return;
	const payload = {
		date: todayString(),
		result: 'loss' as GameResult,
		resetAt: getNextLocalMidnightEpochMs()
	};
	localStorage.setItem(TODAY_KEY, JSON.stringify(payload));
}

export function clearToday(): void {
	if (!isBrowser()) return;
	localStorage.removeItem(TODAY_KEY);
}

export function clearTodayIfExpired(): boolean {
	if (!isBrowser()) return false;
	try {
		const raw = localStorage.getItem(TODAY_KEY);
		if (!raw) return false;
		const parsed = JSON.parse(raw) as { resetAt?: number } | null;
		if (!parsed || !parsed.resetAt) {
			localStorage.removeItem(TODAY_KEY);
			return true;
		}
		if (Date.now() >= parsed.resetAt) {
			localStorage.removeItem(TODAY_KEY);
			return true;
		}
		return false;
	} catch {
		localStorage.removeItem(TODAY_KEY);
		return true;
	}
}

export function formatMs(ms: number): string {
	if (ms <= 0) return '0h 0min 0s';
	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	return `${hours}h ${minutes}min ${seconds}s`;
}
