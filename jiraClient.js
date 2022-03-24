function buildAuthHeader(email, key) {
  return Buffer.from(`${email}:${key}`, "utf-8").toString("base64");
}

function buildHeaders(account, apiKey) {
  return {
    Authorization: buildAuthHeader(account, apiKey),
    Accept: "application/json",
    "Content-Type": "application/json",
  };
}

function buildRequestUrl(domain, path) {
  return `https://${domain}.atlassian.net/${path}`;
}

class JiraClient {
  constructor(domain, account, apiKey) {
    this.domain = domain;
    this.account = account;
    this.apiKey = apiKey;
  }

  async release(params) {
    // await fetch(buildRequestUrl(domain, "/rest/api/3/version"), {
    //   method: "POST",
    //   Headers: buildHeaders(account, apiKey),
    //   body: JSON.stringify(params),
    // });
  }

  async updateFixVersions(issueKey, version) {
    // const body = {
    //   fields: {
    //     fixVersions: [{ add: { name: version } }],
    //   },
    // };

    // await fetch(buildRequestUrl(domain, `/rest/api/3/issue/${issueKey}`), {
    //   method: "PUT",
    //   Headers: buildHeaders(account, apiKey),
    //   body: JSON.stringify(body),
    // });
  }
}

module.exports = { JiraClient };
