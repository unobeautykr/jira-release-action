const core = require("@actions/core");
const github = require("@actions/github");
const release = require("./release");

async function run() {
  try {
    const account = core.getInput("account");
    const apiKey = core.getInput("apiKey");
    const domain = core.getInput("domain");
    const projectId = core.getInput("projectId");
    const projectKey = core.getInput("projectKey");
    const version = core.getInput("version");
    const context = github.context;

    await release({
      account,
      apiKey,
      domain,
      projectKey,
      projectId,
      version,
      context,
    });
  } catch (error) {
    console.error(error);
    core.setFailed(error.message);
  }
}

run();
