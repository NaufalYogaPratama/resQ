import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'assets.promediateknologi.id',
            },
            {
                protocol: 'https',
                hostname: 'lokerpintar.id',
            },
            {
                protocol: 'https',
                hostname: 'www.teachforindonesia.org',
            },
            {
                protocol: 'https',
                hostname: 'pmikotasemarang.or.id',
            },
            {
                protocol: 'https',
                hostname: 'asset.kompas.com',
            },
        ],
    },
};

export default nextConfig;
