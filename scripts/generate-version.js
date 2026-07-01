const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getBuildInfo() {
  const getThaiNow = () => new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date()).replace(',', '');

  // 1. Get Commit Hash from env or git
  let commitHash = process.env.RENDER_GIT_COMMIT || process.env.VERCEL_GIT_COMMIT_SHA || '';
  if (!commitHash) {
    try {
      commitHash = execSync('git rev-parse --short HEAD 2>/dev/null').toString().trim();
    } catch (e) {
      commitHash = 'local';
    }
  } else {
    commitHash = commitHash.substring(0, 7);
  }

  // 2. Get Commit Count for versioning
  let commitCount = process.env.COMMIT_COUNT || '';
  if (!commitCount) {
    try {
      commitCount = execSync('git rev-list --count HEAD 2>/dev/null').toString().trim();
    } catch (e) {
      commitCount = '0';
    }
  }

  const deployedAt = getThaiNow();
  const version = `1.0.0.${commitCount}`;

  const info = {
    version,
    commit: commitHash,
    deployedAt
  };

  console.log('Build Info Generated:', info);

  // Paths
  const apiPath = path.join(__dirname, '../apps/api/src/version.json');
  const webPath = path.join(__dirname, '../apps/web/src/version.json');

  // Write files
  fs.writeFileSync(apiPath, JSON.stringify(info, null, 2));
  fs.writeFileSync(webPath, JSON.stringify(info, null, 2));
}

getBuildInfo();
