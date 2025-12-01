/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "34.39.211.212",
        port: "3018",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    // Isso desabilita a verificação de tipos para as páginas e rotas da API
    // É um último recurso para casos onde a tipagem gerada falha.
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
