import { execSync } from 'node:child_process';
import { defineConfig } from 'vite';

function readGitMetadata() {
  try {
    const remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
    const versionName = execSync('git log -1 --pretty=%s', { encoding: 'utf8' }).trim();
    const githubUserMatch = remoteUrl.match(/github\.com[:/](.+?)\/.+?(\.git)?$/);
    const githubUser = githubUserMatch?.[1] ?? 'unknown';

    return `Bike Trial Game by ${githubUser}, version: ${versionName}`;
  } catch {
    return 'Bike Trial Game';
  }
}

export default defineConfig({
  base: '/bike_trial_game/',
  define: {
    __APP_HEADER_TEXT__: JSON.stringify(readGitMetadata()),
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
});
