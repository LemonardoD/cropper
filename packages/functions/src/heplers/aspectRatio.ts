export interface returnFromFfmpeg {
	programs: [];
	streams: [{ width: number; height: number }];
}

export async function newRatios(info: returnFromFfmpeg) {
	const [{ width }] = info.streams;
	const newHeight = (width / 4) * 3;
	return { width, newHeight };
}

export async function ifVertical(info: returnFromFfmpeg) {
	const [{ width, height }] = info.streams;
	if (height > width) {
		return true;
	}
	return false;
}
