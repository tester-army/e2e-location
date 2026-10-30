import { afterEach, describe, test } from '@e2e-dev/mobile';
import { expect } from 'e2e';

import {
  ALLOW,
  BERLIN,
  BUNDLE_ID,
  coordinates,
  DONT_ALLOW,
  LOCATION_PROMPT,
  nearDamSquare,
  PARIS,
  SETTINGS_APP,
  skipAgent,
} from './fixtures';

// The system prompt isn't our screen, so these tests retry.
describe('location', { retries: 2, timeout: 120_000 }, () => {
  test('allowing shows the city the device is in', async ({ app, device, screen }) => {
    await device.setPermission('location', 'reset');
    await device.setLocation(PARIS);
    await app.open();

    await screen.getByTestId('find-me').tap();
    await expect(screen.getByText(LOCATION_PROMPT)).toBeVisible();
    await screen.getByRole('button', { name: ALLOW }).tap();

    await expect(screen.getByTestId('city')).toHaveText('Paris', { timeout: 15_000 });
    await expect(screen.getByTestId('coordinates')).toHaveText(coordinates(PARIS));
    await expect(screen.getByTestId('permission')).toHaveText('Allowed');
  });

  test('denying explains why and offers Settings', async ({ app, device, screen }) => {
    await device.setPermission('location', 'reset');
    await device.setLocation(PARIS);
    await app.open();

    await screen.getByTestId('find-me').tap();
    await expect(screen.getByText(LOCATION_PROMPT)).toBeVisible();
    await screen.getByRole('button', { name: DONT_ALLOW }).tap();

    await expect(screen.getByTestId('location-denied')).toBeVisible();
    await expect(screen.getByTestId('permission')).toHaveText('Denied');
    await expect(screen.getByTestId('open-settings')).toBeVisible();
    await expect(screen.getByTestId('city')).toBeHidden();
  });

  test(
    'turning location on in Settings brings the city back',
    {
      skip: skipAgent,
      timeout: 180_000,
      agentContext:
        "e2e Location's location access is in the system Settings app. On iOS, scroll down to Apps, then e2e Location → Location (search doesn't list app settings). On Android: Apps → e2e Location → Permissions → Location.",
    },
    async ({ agent, app, device, platform, screen }) => {
      await device.setPermission('location', 'reset');
      await device.setLocation(PARIS);
      await app.open();

      await screen.getByTestId('find-me').tap();
      await expect(screen.getByText(LOCATION_PROMPT)).toBeVisible();
      await screen.getByRole('button', { name: DONT_ALLOW }).tap();
      await expect(screen.getByTestId('location-denied')).toBeVisible();

      await screen.getByTestId('open-settings').tap();
      // iOS reads our app until the session switches; a relaunch also opens Settings on its first page.
      await device.openApp(SETTINGS_APP[platform], { relaunch: true });
      await agent.act('allow e2e Location to use your location while using the app');

      await device.openApp(BUNDLE_ID);
      await screen.getByTestId('find-me').tap();
      await expect(screen.getByTestId('city')).toHaveText('Paris', { timeout: 15_000 });
      await expect(screen.getByTestId('permission')).toHaveText('Allowed');
    },
  );

  test('moving updates the city without another tap', async ({ app, device, screen }) => {
    await device.setPermission('location', 'grant');
    await device.setLocation(PARIS);
    await app.open();

    await screen.getByTestId('find-me').tap();
    await expect(screen.getByTestId('city')).toHaveText('Paris', { timeout: 15_000 });

    await device.setLocation(BERLIN);
    await expect(screen.getByTestId('city')).toHaveText('Berlin', { timeout: 15_000 });
    await expect(screen.getByTestId('coordinates')).toHaveText(coordinates(BERLIN));
  });

  // An iOS simulator shares the Mac's network, so only Android can go offline.
  describe('offline', { platforms: ['android'] }, () => {
    afterEach(async ({ device }) => {
      await device.setAirplaneMode(false);
    });

    test('offline, the city lookup fails with an error', async ({ app, device, screen }) => {
      const amsterdam = nearDamSquare();
      await device.setPermission('location', 'grant');
      await device.setLocation(amsterdam);
      await app.open();

      await device.setAirplaneMode(true);
      await expect(screen.getByTestId('network')).toHaveText('Offline');
      await screen.getByTestId('find-me').tap();
      await expect(screen.getByTestId('coordinates')).toHaveText(coordinates(amsterdam), { timeout: 15_000 });
      await expect(screen.getByTestId('location-error')).toBeVisible({ timeout: 20_000 });

      await device.setAirplaneMode(false);
      await expect(screen.getByTestId('network')).toHaveText('Online', { timeout: 15_000 });
      await screen.getByTestId('find-me').tap();
      await expect(screen.getByTestId('city')).toHaveText('Amsterdam', { timeout: 15_000 });
    });
  });
});
