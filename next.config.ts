import type { NextConfig } from 'next'
 
const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['ckeditor5', '@ckeditor/ckeditor5-react', '@wiris/mathtype-ckeditor5'],
}
 
export default nextConfig