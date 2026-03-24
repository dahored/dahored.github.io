const fs = require('fs');
const path = require('path');

const STATS_PATH = path.join(__dirname, '../../src/data/social-stats.json');

// ── TikTok ──────────────────────────────────────────────────────────────────

const TIKTOK_ACCOUNTS = [
  { key: 'coexist', username: 'daho.coexist', envKey: 'COEXIST_TIKTOK_FOLLOWERS' },
  { key: 'gaming',  username: 'dahored',       envKey: 'GAMING_TIKTOK_FOLLOWERS'  },
];

async function scrapeTikTokFollowers(username) {
  try {
    const res = await fetch(`https://www.tiktok.com/@${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!res.ok) {
      console.log(`  HTTP ${res.status} for @${username}`);
      return null;
    }

    const html = await res.text();

    const match = html.match(/"followerCount"\s*:\s*(\d+)/);
    if (match) return parseInt(match[1], 10);

    const match2 = html.match(/"fans"\s*:\s*(\d+)/);
    if (match2) return parseInt(match2[1], 10);

    console.log(`  Could not find follower count in page for @${username}`);
    return null;
  } catch (err) {
    console.log(`  Scraping error for @${username}: ${err.message}`);
    return null;
  }
}

// ── YouTube ─────────────────────────────────────────────────────────────────

const YOUTUBE_CHANNELS = [
  { key: 'coexist', channelId: 'UCt8BxNAxnQLKBVp_RWDaiuA', envKey: 'COEXIST_YT_SUBSCRIBERS' },
  { key: 'gaming',  channelId: 'UC4OPFQDumPVNn7fxPZCvuFw', envKey: 'GAMING_YT_SUBSCRIBERS'  },
];

async function fetchYouTubeSubscribers(channelId) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.log('  No YOUTUBE_API_KEY set');
    return null;
  }
  try {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`  YouTube API error: HTTP ${res.status}`);
      return null;
    }
    const data = await res.json();
    const count = data.items?.[0]?.statistics?.subscriberCount;
    if (count !== undefined) return parseInt(count, 10);
    console.log(`  No subscriberCount in response for ${channelId}`);
    return null;
  } catch (err) {
    console.log(`  YouTube fetch error: ${err.message}`);
    return null;
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const stats = JSON.parse(fs.readFileSync(STATS_PATH, 'utf8'));
  let updated = false;

  // TikTok
  console.log('\n── TikTok ──────────────────────────────────────');
  for (const { key, username, envKey } of TIKTOK_ACCOUNTS) {
    const manualValue = process.env[envKey];
    let newFollowers = null;

    if (manualValue && manualValue.trim() !== '') {
      newFollowers = parseInt(manualValue, 10);
      console.log(`[${key}] Manual override: ${newFollowers}`);
    } else {
      console.log(`[${key}] Scraping @${username}...`);
      newFollowers = await scrapeTikTokFollowers(username);
      if (newFollowers !== null) {
        console.log(`[${key}] Scraped: ${newFollowers}`);
      } else {
        console.log(`[${key}] Skipped (keeping current: ${stats.tiktok[key].followers})`);
      }
    }

    if (newFollowers !== null && newFollowers !== stats.tiktok[key].followers) {
      stats.tiktok[key].followers = newFollowers;
      updated = true;
    }
  }

  // YouTube
  console.log('\n── YouTube ─────────────────────────────────────');
  for (const { key, channelId, envKey } of YOUTUBE_CHANNELS) {
    const manualValue = process.env[envKey];
    let newSubscribers = null;

    if (manualValue && manualValue.trim() !== '') {
      newSubscribers = parseInt(manualValue, 10);
      console.log(`[${key}] Manual override: ${newSubscribers}`);
    } else {
      console.log(`[${key}] Fetching channel ${channelId}...`);
      newSubscribers = await fetchYouTubeSubscribers(channelId);
      if (newSubscribers !== null) {
        console.log(`[${key}] Fetched: ${newSubscribers}`);
      } else {
        console.log(`[${key}] Skipped (keeping current: ${stats.youtube[key].subscribers})`);
      }
    }

    if (newSubscribers !== null && newSubscribers !== stats.youtube[key].subscribers) {
      stats.youtube[key].subscribers = newSubscribers;
      updated = true;
    }
  }

  if (updated) {
    fs.writeFileSync(STATS_PATH, JSON.stringify(stats, null, 2) + '\n');
    console.log('\nWrote updated social-stats.json');
  } else {
    console.log('\nNo changes — social-stats.json unchanged');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
