import type { E2EConfig } from 'e2e';
import { mobile } from '@e2e-dev/mobile';
import { gateway } from 'ai';

// e2e loads no .env file itself.
try {
  process.loadEnvFile(new URL('.env.local', import.meta.url));
} catch {}

const metro = {
  command: {
    executable: 'npx',
    args: ['expo', 'start', '--port', '8081'],
    reuseExisting: true,
    log: '.e2e/logs/metro.log',
  },
  readyUrl: 'http://localhost:8081/status',
};
const bundleId = 'dev.e2e.location';

export default {
  agents: {
    default: {
      model: gateway('openai/gpt-6-luna-fast'),
      system: 'You are a thorough QA agent. Verify every outcome.',
    },
  },
  targets: [
    {
      name: 'ios',
      engine: mobile({ platform: 'ios', device: process.env.IOS_DEVICE || undefined }),
      // The prompt and the city in English, whatever the simulator's region.
      app: { bundleId, launchArguments: ['-AppleLocale', 'en_US', '-AppleLanguages', '(en)'], ...metro },
    },
    {
      name: 'android',
      engine: mobile({ platform: 'android', device: process.env.ANDROID_DEVICE || undefined }),
      app: { bundleId, ...metro },
    },
  ],
  workers: 1,
} satisfies E2EConfig;
