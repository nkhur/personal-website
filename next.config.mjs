/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
      // Ensure webpack respects the jsconfig paths
      return config;
    },
  };
  
  export default nextConfig;
  