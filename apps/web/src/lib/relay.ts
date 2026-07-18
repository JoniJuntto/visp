export function medianRoundTrip(samples: number[]) {
	if (samples.length === 0) {
		throw new Error("At least one RTT sample is required");
	}
	const sorted = [...samples].sort((a, b) => a - b);
	return Math.round(sorted[Math.floor(sorted.length / 2)] ?? 0);
}

export async function probeRelayRtt(url: string, sampleCount = 7) {
	const samples: number[] = [];
	for (let index = 0; index < sampleCount; index += 1) {
		const startedAt = performance.now();
		const response = await fetch(`${url}?sample=${index}`, {
			cache: "no-store",
		});
		if (!response.ok) {
			throw new Error(`Relay probe failed with ${response.status}`);
		}
		samples.push(performance.now() - startedAt);
	}
	return medianRoundTrip(samples);
}
