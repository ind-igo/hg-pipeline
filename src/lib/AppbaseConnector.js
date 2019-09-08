require('dotenv').config()
const Appbase = require("appbase-js")

const {HOST_URL, APP_NAME, APPBASE_CREDENTIALS } = process.env
const appbaseRef = Appbase({
  url: HOST_URL,
  app: APP_NAME,
  credentials: APPBASE_CREDENTIALS
});

function IndexVideoData()