import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['ridbizecom.s3.ap-southeast-1.amazonaws.com'], // Add the S3 bucket domain
  },
};

export default nextConfig;
