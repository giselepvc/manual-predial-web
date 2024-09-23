module.exports = {
  compiler: {
    styledComponents: {
      ssr: true,
    },
  },
  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
