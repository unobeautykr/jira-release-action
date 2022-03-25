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

async function getChanges(from, to) {
  return new Promise((resolve, reject) => {
    const commits = [];
    const readable = gitRawCommits({
      from,
      to,
    });
    readable.on("error", (e) => {
      reject(e);
    });

    const writable = new Writable();
    writable._write = function (chunk, encoding, done) {
      commits.push(chunk.toString("utf-8"));
      done();
    };
    writable.on("end", () => {
      resolve(commits);
    });
    writable.on("finish", () => {
      resolve(commits);
    });

    writable.on("error", (e) => {
      reject(e);
    });

    readable.pipe(writable);
  });
}

function getResolvedIssues(changes, projectKey) {
  const resolvedIssues = new Set();
  for (const change of changes) {
    const issueIdRegEx = new RegExp(`${projectKey}-([0-9]+)`, "g");

    change.match(issueIdRegEx).forEach((issueKey) => {
      resolvedIssues.add(issueKey);
    });
  }

  return resolvedIssues;
}

module.exports = async function release({
  account,
  apiKey,
  domain,
  projectKey,
  projectId,
  version,
  context,
}) {
  const jiraClient = new JiraClient(domain, account, apiKey);

  const jiraVersionName = `${context.repo.repo}/${version}`;

  const res = await jiraClient.release({
    archived: false,
    releaseDate: dayjs.utc().format("YYYY-MM-DD"),
    name: jiraVersionName,
    description: `Version created by github action. https://github.com/${context.repo.owner}/${context.repo.repo}/releases/tag/${version}`,
    projectId: projectId,
    released: false,
  });

  if (!res.ok) {
    throw new Error(`Creating JIRA Release failed with ${res.status}`);
  }

  const previousVersion = await getPreviousVersion(version);

  console.log(`Prev version ${previousVersion} found`);

  const changes = await getChanges(previousVersion, version);
  console.log(changes);
  const resolvedIssues = getResolvedIssues(changes, projectKey);
  console.log(resolvedIssues);

  for (const issue of resolvedIssues) {
    await jiraClient.updateFixVersions(issue, jiraVersionName);
  }
};
