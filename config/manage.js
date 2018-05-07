exports.setEnvironments = () => {
  let ev = '',
    cfg;

  // stack mode assumes docker stack configured to use own environment files
  if (!process.env.NODE_CONTAINER_STACK || process.env.TRAVIS_CI) {
    if (process.env.NODE_ENV === 'production') {
      ev = 'prod';
    } else if (process.env.NODE_ENV === 'ci') {
      ev = 'ci';
    } else {
      ev = 'dev';
    }
    cfg = `./config/${ev}.local.env`;
    require('dotenv').config({ path: cfg });
    require('dotenv').config({ path: './config/shared.env' });
  }
};
