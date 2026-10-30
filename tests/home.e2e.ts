import { test } from '@e2e-dev/mobile';
import { expect } from 'e2e';

import { LOCATION_PROMPT } from './fixtures';

test('a fresh launch asks for nothing until you tap Find me', async ({ app, device, screen }) => {
  await device.setPermission('location', 'reset');
  await app.open();

  // The first launch waits for Metro to bundle the app.
  await expect(screen.getByText('Where are you?')).toBeVisible({ timeout: 60_000 });
  await expect(screen.getByTestId('find-me')).toBeVisible();
  await expect(screen.getByTestId('permission')).toHaveText('Not asked yet');
  await expect(screen.getByText(LOCATION_PROMPT)).toBeHidden();
});
