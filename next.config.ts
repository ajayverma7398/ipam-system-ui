import type { NextConfig } from "next";

/**
 * Next.js Configuration
 * 
 * Production Build Stability:
 * - Turbopack is disabled for production builds via NEXT_PRIVATE_SKIP_TURBO=1 in package.json
 * - Webpack is used for reliable production builds on Windows
 * - This avoids "TurbopackInternalError: Failed to write app endpoint /page" errors
 * - Development can still use Turbopack (via `next dev`) if stable
 * 
 * Note: The build script in package.json sets NEXT_PRIVATE_SKIP_TURBO=1 to force Webpack usage
 * for production builds, ensuring compatibility with Tailwind CSS v4 and PostCSS on Windows.
 */
const nextConfig: NextConfig = {
  // No experimental.turbo configuration needed
  // Turbopack is controlled via environment variable in build script
};

export default nextConfig;
