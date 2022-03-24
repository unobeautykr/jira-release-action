const fetch = require("node-fetch");

function buildAuthHeader(email, key) {
  return `Basic ${Buffer.from(`${email}:${key}`, "utf-8").toString("base64")}`;
}

function buildHeaders(account, apiKey) {
  return {
    Authorization: buildAuthHeader(account, apiKey),
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

function buildRequestUrl(domain, path) {
  return `https://${domain}.atlassian.net${path}`;
}

class JiraClient {
  constructor(domain, account, apiKey) {
    this.domain = domain;
    this.account = account;
    this.apiKey = apiKey;
  }

  async release(params) {
    return await fetch(buildRequestUrl(this.domain, "/rest/api/3/version"), {
      method: "POST",
      headers: buildHeaders(this.account, this.apiKey),
      body: JSON.stringify(params),
    });
  }

  async updateFixVersions(issueKey, version) {
    const body = {
      update: {
        fixVersions: [{ add: { name: version } }],
      },
    };

    const res = await fetch(
      buildRequestUrl(this.domain, `/rest/api/3/issue/${issueKey}`),
      {
        method: "PUT",
        headers: buildHeaders(this.account, this.apiKey),
        body: JSON.stringify(body),
      }
    );

    console.log(res);
  }
}

module.exports = { JiraClient };
