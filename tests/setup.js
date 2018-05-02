require('dotenv').config({ path: './config/ci.env' });
require('../models/User');

jest.setTimeout(15000); // 15 second limit per failed test

/// travis-ci needs mongodb://127.0.0.1/reactboiler
if (process.env.TRAVIS_CI) {
  process.env.MONGO_URI = 'mongodb://127.0.0.1/reactboiler';
}

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });
