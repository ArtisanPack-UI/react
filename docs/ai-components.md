---
title: AI Components
menu_order: 7
---

# AI Components

The `@artisanpack-ui/react/ai` subpath has admin screens for the [`artisanpack-ui/ai`](https://github.com/ArtisanPack-UI/ai) Laravel package's JSON API: a settings form, a usage dashboard and a feature list. They give a React app the same admin surfaces as the Livewire ones.

They're built from the design system components (Form, Select, Password, Table, Stat, Toggle, Alert and the rest), so they follow your theme, density and preset, and need only `@artisanpack-ui/css`. Their text is English and isn't configurable through props.

The subpath ships inside `@artisanpack-ui/react`, and the package root doesn't export it, so nothing from it reaches your bundle unless you import it.

## Quick start

```tsx
import {
  createAiApiClient,
  FeatureToggles,
  SettingsPage,
  UsageDashboard,
} from '@artisanpack-ui/react/ai';
import { Stack } from '@artisanpack-ui/react/layout';
import { useMemo } from 'react';

export function AiAdminPage() {
  // Built during render, not at module scope, so the import is safe on the server.
  const client = useMemo(
    () =>
      createAiApiClient({
        baseUrl: '/api/artisanpack-ai',
        headers: {
          'X-CSRF-TOKEN':
            typeof document === 'undefined'
              ? ''
              : (document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? ''),
        },
      }),
    [],
  );

  return (
    <Stack gap="8">
      <SettingsPage client={client} heading="AI settings" />
      <UsageDashboard client={client} refreshInterval={15_000} heading="Usage" />
      <FeatureToggles client={client} heading="Features" />
    </Stack>
  );
}
```

Create the client once with `useMemo` (or in a module that only runs in the browser). Don't read `document` at module scope: in a server-rendered app that import throws `ReferenceError: document is not defined`. Each component reloads its data when it receives a different `client`.

## createAiApiClient

Builds an `AiApiClient` on `fetch`:

| Option      | Type                     | What it does                                                                               |
| ----------- | ------------------------ | ------------------------------------------------------------------------------------------ |
| `baseUrl`   | `string`                 | The API prefix, matching the ai package's routes. A trailing slash is ignored.             |
| `headers`   | `Record<string, string>` | Added to every request: a CSRF token, a bearer token, or anything else.                    |
| `fetchImpl` | `typeof fetch`           | Replaces the global `fetch`, for tests or to add options such as `credentials: 'include'`. |

Requests send `Accept: application/json`, and `Content-Type: application/json` only when they have a body. A non-2xx response rejects with `AiApiError`, which has the HTTP `status`, the parsed `body`, and the response's `message` when it has one.

The components depend only on the `AiApiClient` interface, so an app with its own HTTP layer (Axios, a Sanctum wrapper) can implement it directly: `getSettings`, `updateSettings`, `testConnection`, `getFeatures`, `toggleFeature` and `getUsage`.

## SettingsPage

A form for the provider credentials and the per-feature overrides, backed by `GET` and `PUT /settings` and `POST /test-connection`.

| Prop        | Type          | Default                             |
| ----------- | ------------- | ----------------------------------- |
| `client`    | `AiApiClient` | Required                            |
| `providers` | `string[]`    | `['openai', 'anthropic', 'ollama']` |
| `heading`   | `string`      |                                     |

- **The stored key stays on the server.** The API reports only whether a key is stored. The API key field starts empty; leaving it blank keeps the stored key, for both saving and testing the connection. The field is hidden for Ollama, where the base URL is required instead.
- **Switching provider clears the typed key** and the last connection test result, so a key is never tested or saved against the wrong provider.
- **Test connection** reports its result next to the button. A result arrives only for the credentials that were tested: editing them, a successful save or a reload while a test is running discards it.
- **Validation errors** from a `422` response show under their fields, with the response's message in an alert above the form. Other failures show in the alert.
- **A failed load** shows an error alert with a **Retry** button. Only the latest load updates the form.
- The fields are disabled while saving.

## UsageDashboard

Totals, a per-feature table and a daily table, backed by `GET /usage`.

| Prop              | Type          | Default  | What it does                                             |
| ----------------- | ------------- | -------- | -------------------------------------------------------- |
| `client`          | `AiApiClient` | Required |                                                          |
| `from`, `to`      | `string`      |          | The date range (`YYYY-MM-DD`), sent as query parameters. |
| `refreshInterval` | `number`      | `0`      | Milliseconds between refreshes. `0` turns polling off.   |
| `heading`         | `string`      |          |                                                          |

- **Polling never overlaps.** The next request is scheduled only after the previous one settles, so a slow response can't overwrite a newer one.
- **Changing the range or the client** clears the figures and loads again. Responses for the old range are discarded.
- **A failed refresh keeps the last figures** under a warning alert, and the next poll tries again. A failed first load shows an error alert.
- Costs are shown in US dollars.

## FeatureToggles

A switch per registered AI feature, backed by `GET /features` and `POST /features/{key}/toggle`.

| Prop       | Type                                           | What it does                                      |
| ---------- | ---------------------------------------------- | ------------------------------------------------- |
| `client`   | `AiApiClient`                                  | Required                                          |
| `heading`  | `string`                                       | Shown in the loading, empty and error states too. |
| `onToggle` | `(feature: { key, package, enabled }) => void` | Called after the server saves a change.           |

- **Optimistic.** A switch flips at once and is disabled until the server answers. If the request fails, it flips back and an error alert appears.
- If `onToggle` throws, the error is logged and the saved change stays.
- With no features registered, it shows an empty state. A failed load shows an error alert.

## useStreamingText

Reads a `fetch` response body as a stream of UTF-8 text, for output generated over time:

```tsx
import { useStreamingText } from '@artisanpack-ui/react/ai';
import { Button } from '@artisanpack-ui/react';

function AgentOutput({ url }: { url: string }) {
  const { text, streaming, error, start, stop, reset } = useStreamingText();

  return (
    <>
      <Button onClick={() => start(url)} loading={streaming}>
        Run
      </Button>
      <Button onClick={stop} disabled={!streaming}>
        Stop
      </Button>
      <Button onClick={reset}>Clear</Button>
      <pre>{text}</pre>
      {error ? <p role="alert">{error.message}</p> : null}
    </>
  );
}
```

`start(url, init?)` aborts any stream in flight, clears the text and starts a new one; a stopped or replaced stream never writes to the state again. It honors an `AbortSignal` you pass in `init`, and aborts on unmount. A non-2xx response sets `error`.

The ai package's API has no streaming route: point the hook at an endpoint of your own app that streams its response.

## Types

All exported from `@artisanpack-ui/react/ai`, for writing your own client or screens: `AiApiClient`, `AiApiError`, `CreateAiApiClientOptions`, `AiCredentials`, `AiSettingsResponse`, `AiSettingsUpdate`, `AiFeatureOverride`, `AiFeature`, `AiConnectionTestResult`, `AiUsageResponse`, `AiUsageTotals`, `AiUsageByFeature`, `AiUsageDaily`, `AiValidationError`, the components' props types and `UseStreamingTextResult`.
