export type GameResult = 'win' | 'loss';

export interface TodayStatus {
	playedToday: boolean;
	result?: GameResult;
	guessedName?: string;
	resetAt: number; // epoch ms
}

const GUESSED_KEY = 'mikkle_guessed_names';
const ACTIVE_PROFILE_KEY = 'mikkle_active_profile';
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
	return listGuessedNamesForProfile(getActiveProfile());
}

export function addGuessedName(name: string): void {
	if (!isBrowser()) return;
	const profile = getActiveProfile();
	const map = readProfilesMap();
	const current = new Set(map[profile] ?? []);
	current.add(name);
	map[profile] = Array.from(current);
	localStorage.setItem(GUESSED_KEY, JSON.stringify(map));
}

export function clearGuessedNames(): void {
	if (!isBrowser()) return;
	const profile = getActiveProfile();
	const map = readProfilesMap();
	map[profile] = [];
	localStorage.setItem(GUESSED_KEY, JSON.stringify(map));
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

// Profiles support
type ProfilesMap = Record<string, string[]>;

function sanitizeNames(list: unknown): string[] {
	if (!Array.isArray(list)) return [];
	return (list as unknown[]).filter((x) => typeof x === 'string') as string[];
}

function readProfilesMap(): ProfilesMap {
	if (!isBrowser()) return { Default: [] };
	try {
		const raw = localStorage.getItem(GUESSED_KEY);
		if (!raw) return { Default: [] };
		const parsed = JSON.parse(raw);
		if (Array.isArray(parsed)) {
			const migrated: ProfilesMap = { Default: sanitizeNames(parsed) };
			localStorage.setItem(GUESSED_KEY, JSON.stringify(migrated));
			return migrated;
		}
		if (parsed && typeof parsed === 'object') {
			const out: ProfilesMap = {};
			for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
				out[key] = sanitizeNames(value);
			}
			return Object.keys(out).length > 0 ? out : { Default: [] };
		}
		return { Default: [] };
	} catch {
		return { Default: [] };
	}
}

export function listProfiles(): string[] {
	const map = readProfilesMap();
	return Object.keys(map);
}

export function getActiveProfile(): string {
	if (!isBrowser()) return 'Default';
	try {
		const raw = localStorage.getItem(ACTIVE_PROFILE_KEY);
		return raw && typeof raw === 'string' ? raw : 'Default';
	} catch {
		return 'Default';
	}
}

export function setActiveProfile(profileName: string): void {
	if (!isBrowser()) return;
	const name = profileName && profileName.trim() ? profileName.trim() : 'Default';
	// Ensure profile exists
	const map = readProfilesMap();
	if (!map[name]) {
		map[name] = [];
		localStorage.setItem(GUESSED_KEY, JSON.stringify(map));
	}
	localStorage.setItem(ACTIVE_PROFILE_KEY, name);
	// Notify same-tab listeners
	try {
		window.dispatchEvent(new CustomEvent('mikkle-profile-changed', { detail: { profile: name } }));
	} catch {}
}

export function listGuessedNamesForProfile(profileName: string): string[] {
	const map = readProfilesMap();
	return map[profileName] ?? [];
}

export function formatMs(ms: number): string {
	if (ms <= 0) return '0h 0min 0s';
	const totalSeconds = Math.floor(ms / 1000);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = totalSeconds % 60;
	return `${hours}h ${minutes}min ${seconds}s`;
}
