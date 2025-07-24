const { Octokit } = require("@octokit/core");
const fs = require("fs");

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const owner = "opensource-society";
const repo = "notesvault";

const levels = ["level1", "level2", "level3"];
const leaderboard = {};

async function fetchClosedIssues() {
  const issues = [];

  for (const label of levels) {
    let page = 1;
    let fetched = [];

    do {
      const res = await octokit.request(
        `GET /repos/${owner}/${repo}/issues`,
        {
          state: "closed",
          labels: label,
          per_page: 100,
          page,
        }
      );

      fetched = res.data;
      issues.push(...fetched);
      page++;
    } while (fetched.length === 100);
  }

  return issues;
}

async function fetchMergedPRs(username) {
  let count = 0;
  let page = 1;
  let result;

  do {
    result = await octokit.request(
      `GET /search/issues`,
      {
        q: `repo:${owner}/${repo} type:pr author:${username} is:merged`,
        per_page: 100,
        page
      }
    );

    count += result.data.items.length;
    page++;
  } while (result.data.items.length === 100);

  return count;
}

async function generateLeaderboard() {
  const issues = await fetchClosedIssues();

  for (const issue of issues) {
    const assignees = issue.assignees.map(user => user.login);

    for (const user of assignees) {
      if (!leaderboard[user]) {
        leaderboard[user] = { level1: 0, level2: 0, level3: 0, prs: 0 };
      }

      for (const label of issue.labels) {
        if (levels.includes(label.name)) {
          leaderboard[user][label.name]++;
        }
      }
    }
  }

  for (const user of Object.keys(leaderboard)) {
    leaderboard[user].prs = await fetchMergedPRs(user);
  }

  let md = `| Username | Level 1 | Level 2 | Level 3 | PRs Merged |\n`;
  md += `|----------|---------|---------|---------|-------------|\n`;

  for (const [user, data] of Object.entries(leaderboard)) {
    md += `| @${user} | ${data.level1} | ${data.level2} | ${data.level3} | ${data.prs} |\n`;
  }

  fs.writeFileSync("LEADERBOARD.md", md);
}

generateLeaderboard().catch(console.error);
