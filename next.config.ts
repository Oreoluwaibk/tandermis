import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/invite",
        destination: "/team-invitation",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
