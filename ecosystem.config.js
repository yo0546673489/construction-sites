// PM2 production config — מופעל בשרת ב-/home/webapp/platform/my-website
module.exports = {
  apps: [
    {
      name: "pro-digital",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      cwd: "/home/webapp/platform/my-website",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "127.0.0.1",
      },
      max_memory_restart: "2G",
      error_file: "/home/webapp/logs/error.log",
      out_file: "/home/webapp/logs/out.log",
      time: true,
      autorestart: true,
    },
  ],
};
