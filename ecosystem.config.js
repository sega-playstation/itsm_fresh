module.exports = {
  apps: [
    // Backend (Django)
    {
      name: "backend",
      script: "manage.py",
      args: ["runserver", "127.0.0.1:8000"],
      cwd: "/root/ITSM-3.0/backend",
      exec_mode: "fork",
      instances: 1,
      wait_ready: true,
      autorestart: false,
      max_restarts: 5,
      interpreter: "python3",
    },
    // Frontend (Vite)
    {
      name: "frontend",
      script: "serve",
      env: {
        PM2_SERVE_PATH: ".",
        PM2_SERVE_PORT: 3000,
        PM2_SERVE_SPA: "true",
        PM2_SERVE_HOMEPAGE: "./index.html",
      },
      cwd: "/root/ITSM-3.0/frontend",
      exec_mode: "fork",
      instances: 1,
      wait_ready: true,
      autorestart: false,
      max_restarts: 5,
    },
  ],
};
