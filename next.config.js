/** @type {import('next').NextConfig} */
// const withTM = require('next-transpile-modules')([
//   'antd-mobile',
// ]);

const withLess = require("next-with-less");
const nextConfig = withLess({
  reactStrictMode: true,
  swcMinify: true,
});

module.exports = nextConfig
