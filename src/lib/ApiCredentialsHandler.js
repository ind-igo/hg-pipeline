require('dotenv').config()
const { google } = require('googleapis')
const { YT_API_KEY: auth } = process.env

// TODO Why is this necessary?
function GetApiClient() {
  
}