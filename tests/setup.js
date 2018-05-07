const env = require('../config/manage').setEnvironments();
require('../models/User');

jest.setTimeout(15000); // 15 second limit per failed test

const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });
