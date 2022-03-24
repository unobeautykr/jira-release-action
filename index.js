const core = require("@actions/core");
const github = require("@actions/github");
const fetch = require("node-fetch");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const { JiraClient } = require("./jiraClient");
const { runCommand } = require("./cmd");
const semver = require("semver");
const gitRawCommits = require("git-raw-commits");
const { Writable } = require("stream");

dayjs.extend(utc);

async function getPreviousVersion(version) {
  tags_out = await runCommand(
    `git for-each-ref --sort=creatordate --format '%(refname:lstrip=2)' refs/tags`
  );

  tags = tags_out
    .split("\n")
    .map((t) => t.trim())
    .filter((t) => t !== "");

  for (let i = tags.length - 1; i >= 0; i--) {
    if (semver.lt(tags[i], version)) {
      return tags[i];
    }
  }

  return null;
}

function updateFixVersions(from, to) {
  const readable = gitRawCommits({
    from,
    to,
  });

  const writable = new WritableStream();
  writable._write = function (chunk, encoding, done) {
    console.log(chunk.toString());
    done();
  };

  readable.pipe(writable);
}

async function run() {
  try {
    // const account = core.getInput("account");
    // const apiKey = core.getInput("apiKey");
    // const domain = core.getInput("domain");
    // const projectId = core.getInput("projectId");
    // const version = core.getInput("version");
    // const context = github.context;

    const account = "test";
    const apiKey = "test";
    const domain = "test";
    const projectId = "CRM";
    const version = "0.0.2";
    const context = {
      repo: {
        owner: "rkdrnf",
        repo: "repo",
      },
    };

    const jiraClient = new JiraClient(domain, account, apiKey);

    await jiraClient.release({
      archived: false,
      releaseDate: dayjs.utc().format("YYYY-MM-DD"),
      name: `${context.repo.repo}/version`,
      description: `Version created by github action. https://github.com/${context.repo.owner}/${context.repo.repo}/releases/tag/${version}`,
      projectId: projectId,
      released: true,
    });

    const previousVersion = getPreviousVersion();

    updateFixVersions(previousVersion, version);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
