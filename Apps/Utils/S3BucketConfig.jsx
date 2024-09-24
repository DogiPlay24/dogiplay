// import { S3 } from "aws-sdk";

// export const s3bucket = new S3({
//   accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY,
//   secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_KEY,
//   region: process.env.EXPO_PUBLIC_AWS_REGION,
// });

import { S3 } from "aws-sdk";

const s3bucket = new S3({
  accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY,
  secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_KEY,
  region: process.env.EXPO_PUBLIC_AWS_REGION,
});

export default s3bucket;
