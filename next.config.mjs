const isTauri = process.env.BUILD_FOR_TAURI === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
	typescript: {
		ignoreBuildErrors: true,
	},
	images: {
		unoptimized: true,
	},

	// Tauri-only: static export config
	...(isTauri
		? {
				output: "export",
				distDir: "out",
				trailingSlash: true,
			}
		: {}),

	// Web-only: server headers (skipped for Tauri)
	...(!isTauri
		? {
				async headers() {
					return [
						{
							source: "/(.*)",
							headers: [
								{
									key: "X-DNS-Prefetch-Control",
									value: "on",
								},
								{
									key: "X-Frame-Options",
									value: "SAMEORIGIN",
								},
								{
									key: "X-Content-Type-Options",
									value: "nosniff",
								},
								{
									key: "Referrer-Policy",
									value: "strict-origin-when-cross-origin",
								},
								{
									key: "Permissions-Policy",
									value: "camera=(), microphone=(), geolocation=()",
								},
								{
									key: "Content-Security-Policy",
									value:
										"default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'self';",
								},
							],
						},
					];
				},
			}
		: {}),
};

export default nextConfig;
