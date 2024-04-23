/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
		config.externals.push("@node-rs/argon2", "@node-rs/bcrypt");
		return config;
	},
  experimental: {
    serverComponentsExternalPackages: ["oslo"]
  }
};

export default nextConfig;
