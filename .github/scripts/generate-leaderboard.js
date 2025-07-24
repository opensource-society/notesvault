const fs = require("fs");
const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const owner = "opensource-society";
const repo = "notesvault";

async function fetchIssuesByLabel(label) {
  const issues = await octokit.paginate(octokit.issues.listForRepo, {
    owner,
    repo,
    state: "closed",
    labels: label,
    per_page: 100,
  });

  return issues.filter((issue) => issue.assignees.length > 0);
}

async function getMergedPRs(username) {
  const prs = await octokit.paginate(octokit.pulls.list, {
    owner,
    repo,
    state: "closed",
    per_page: 100,
  });

  return prs.filter((pr) => pr.user.login === username && pr.merged_at).length;
}

async function generateLeaderboard() {
  const levels = ["level1", "level2", "level3"];
  const contributorData = {};

  for (const level of levels) {
    const issues = await fetchIssuesByLabel(level);

    for (const issue of issues) {
      for (const assignee of issue.assignees) {
        const username = assignee.login;

        if (!contributorData[username]) {
          contributorData[username] = { level1: 0, level2: 0, level3: 0, mergedPRs: 0 };
        }

        contributorData[username][level]++;
      }
    }
  }

  for (const username of Object.keys(contributorData)) {
    contributorData[username].mergedPRs = await getMergedPRs(username);
  }

  let markdown = `# 🏆 Contributor Leaderboard

| Username | Level 1 | Level 2 | Level 3 | PRs Merged |
|----------|---------|---------|---------|------------|
`;

  for (const [username, data] of Object.entries(contributorData)) {
    markdown += `| @${username} | ${data.level1} | ${data.level2} | ${data.level3} | ${data.mergedPRs} |\n`;
  }

  fs.writeFileSync("LEADERBOARD.md", markdown);
}

generateLeaderboard().catch((err) => {
  console.error("Error generating leaderboard:", err);
  process.exit(1);
});
