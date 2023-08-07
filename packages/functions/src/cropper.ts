import { S3Handler } from "aws-lambda";
import fs from "fs";
import { exec } from "node:child_process";
import { alreadyCropped, getS3Object, s3 } from "./heplers/s3";
import { ifVertical, newRatios, returnFromFfmpeg } from "./heplers/aspectRatio";

export const main: S3Handler = async event => {
	const Key = event.Records[0].s3.object.key;
	const Bucket = event.Records[0].s3.bucket.name;

	try {
		const fileFromS3 = await getS3Object({ Key, Bucket });
		if (fileFromS3.Body) {
			fs.writeFileSync(`/temp/${Key}`, fileFromS3.Body as Buffer);
		}
		if (!alreadyCropped(Key)) {
			const newKey = `cropped.${Key}`;
			const videoInfo = exec(
				`ffprobe -v error -select_streams v -show_entries stream=width,height -of json ${Key}`,
				(err, data) => {
					if (err) throw err;
					return JSON.parse(data);
				},
			);
			const retFromFfmpeg = videoInfo as unknown as returnFromFfmpeg;
			if (await ifVertical(retFromFfmpeg)) {
				const { width, newHeight } = await newRatios(retFromFfmpeg);
				exec(`ffmpeg -i -filter:v crop=${width}:${newHeight} /tmp/${newKey}`);
				const croppedVideo = fs.readFileSync(`/tmp/${newKey}`);
				const params = {
					Key: newKey,
					Bucket: Bucket,
					Body: croppedVideo,
				};
				await s3.putObject(params).promise();
				fs.unlinkSync(`/temp/${newKey}`);
				fs.unlinkSync(`/temp/${Key}`);
			}
		}
	} catch (err) {
		throw err;
	}
};
