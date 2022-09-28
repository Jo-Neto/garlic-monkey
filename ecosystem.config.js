module.exports = {
    apps: [
      {
        script: 'socket-server.js',
        cwd: 'backend-socket/',
        name: 'WebSocket',
        watch: true,
      },
      {
        script: 'server.js',
        cwd: 'backend/',
        name: 'Redis',
        watch: true,
      }
    ]
  }