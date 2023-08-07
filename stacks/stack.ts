import { Bucket, StackContext } from "sst/constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";

export function FirstStack({ stack }: StackContext) {
	const bucket = new Bucket(stack, "Bucket", {
		notifications: {
			resize: {
				function: {
					handler: "packages/functions/src/cropper.main",
					nodejs: {
						esbuild: {
							external: ["fluent-ffmpeg"],
						},
					},
				},
				events: ["object_created"],
			},
		},
	});

	// Allow the notification functions to access the bucket
	bucket.attachPermissions([bucket]);
	// Show the endpoint in the output
	stack.addOutputs({
		BucketName: bucket.bucketName,
	});
}
