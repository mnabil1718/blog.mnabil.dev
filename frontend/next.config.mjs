// @ts-check

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'upload.wikimedia.org',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '8080',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;