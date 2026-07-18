/** Buckets a peak mic level (0-1) into meter tiers: 0 silent, 1 low, 2 high, 3 loud. */
export type AudioTier = 0 | 1 | 2 | 3;

export const AUDIO_TIER_COLORS: Record<AudioTier, string> = {
	0: "#8a93a2",
	1: "#3fca5a",
	2: "#f5c542",
	3: "#ff354d",
};

export const AUDIO_TIER_LABELS: Record<AudioTier, string> = {
	0: "silent",
	1: "low",
	2: "high",
	3: "loud",
};

export function audioTierForLevel(level: number): AudioTier {
	if (level >= 0.7) {
		return 3;
	}
	if (level >= 0.35) {
		return 2;
	}
	if (level >= 0.02) {
		return 1;
	}
	return 0;
}
