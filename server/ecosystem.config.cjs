module.exports = {
  apps: [{
    name: 'djb-api',
    script: './src/index.js',
    cwd: '/var/www/djbportfolio/server',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
    },
    max_memory_restart: '500M',
    time: true
  }]
}
