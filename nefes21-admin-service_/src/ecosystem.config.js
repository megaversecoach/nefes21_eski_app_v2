module.exports = {
  apps : [{
    script: './app.js',
    name : 'admin-panel',
    time : true,
    env : {
      NODE_ENV : 'test'
    },
    env_development : {
      NODE_ENV : 'development'
    },
    env_production : {
      NODE_ENV : 'production'
    }
  }]
};
