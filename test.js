require('dotenv').config()
const release = require("./release");

const account = process.env.ACCOUNT;
const apiKey = process.env.API_KEY;
const domain = process.env.DOMAIN;
const projectKey = process.env.PROJECT_KEY;
const projectId = process.env.PROJECT_ID;
const version = process.env.VERSION;
const context = {
  repo: {
    owner: process.env.OWNER,
    repo: process.env.REPO,
  },
};

release({
  account,
  apiKey,
  domain,
  projectKey,
  projectId,
  version,
  context,
});
