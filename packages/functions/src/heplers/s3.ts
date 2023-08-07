import AWS from "aws-sdk";

interface getInfoDTO {
	Bucket: string;
	Key: string;
}
export const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export async function getS3Object(getInfo: getInfoDTO) {
	return await s3.getObject(getInfo).promise();
}

export async function alreadyCropped(str: string) {
	if (str.startsWith("cropped")) {
		return true;
	}
	return false;
}
