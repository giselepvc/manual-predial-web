module.exports = {
  compiler: {
    styledComponents: {
      ssr: true,
    },
  },
  images: {
    domains: ['api.manualpredial.com.br'],
  },
  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
