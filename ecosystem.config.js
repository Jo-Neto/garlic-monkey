module.exports = {
    apps: [
      // {
      //   name: "Frontend",
      //   cwd: "frontend/",
      //   script: "npm",
      //   node_args: ["run", "dev"],
      //   automation: false,
      //   wait_ready: true
      // },
      // {
      //   script: 'npm run dev',
      //   cwd: 'frontend/',
      //   name: 'Frontend',
      //   watch: true
      // },
      {
        script: 'socket-server.js',
        cwd: 'backend-socket/',
        name: 'WebSocket',
        watch: true,
        wait_ready: true
      },
      {
        script: 'server.js',
        cwd: 'backend/',
        name: 'Redis',
        watch: true,
        wait_ready: true
      }
    ]
  }