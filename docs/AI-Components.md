# AI Components

React components + hooks for consuming the [`artisanpack-ui/ai`](https://github.com/ArtisanPack-UI/ai) JSON API. Shipped as the `@artisanpack-ui/react/ai` subpath in 1.0.2.

The subpath gives Laravel apps a drop-in replacement for the Livewire admin surfaces (Settings page, Usage dashboard, Feature toggles) so React starter kits don't have to depend on Livewire.

## Installation

`@artisanpack-ui/react/ai` ships inside `@artisanpack-ui/react` — no extra install needed:

```bash
npm install @artisanpack-ui/react
```

The subpath is optional. If you never import from `@artisanpack-ui/react/ai`, none of these components are pulled into your bundle.

## Quick start

```tsx
import {
  createAiApiClient,
  SettingsPage,
  UsageDashboard,
  FeatureToggles,
} from '@artisanpack-ui/react/ai';

const client = createAiApiClient({
  baseUrl: '/api/artisanpack-ai',
  headers: {
    'X-CSRF-TOKEN':
      document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '',
  },
});

export function AiAdminPage() {
  return (
    <div className="flex flex-col gap-8">
      <SettingsPage client={client} heading="AI Settings" />
      <UsageDashboard client={client} refreshInterval={15_000} heading="Usage" />
      <FeatureToggles client={client} heading="Features" />
    </div>
  );
}
```

## `createAiApiClient`

Builds a small `fetch` wrapper implementing the `AiApiClient` contract every component depends on.

```ts
const client = createAiApiClient({
  baseUrl: '/api/artisanpack-ai',
  headers: { Authorization: `Bearer ${token}` },
  fetchImpl: (input, init) => fetch(input, { ...init, credentials: 'include' }),
});
```

| Option      | Type                       | Notes                                                                                        |
|-------------|----------------------------|----------------------------------------------------------------------------------------------|
| `baseUrl`   | `string`                   | Prefix for every request. Match the ai package's route prefix (default `/api/artisanpack-ai`). |
| `headers`   | `Record<string, string>`   | Merged into every request. Use for CSRF, Sanctum bearer, or custom headers.                  |
| `fetchImpl` | `typeof fetch`             | Override the global `fetch`. Use for tests or to set `credentials: 'include'` on cross-origin Sanctum. |

Non-2xx responses reject with `AiApiError`, which exposes `.status` and the parsed `.body` — perfect for surfacing Laravel's 422 `{ message, errors }` envelope inline.

If your app has its own HTTP layer (Axios, Ky, a Sanctum-aware wrapper), implement the `AiApiClient` interface directly rather than using `createAiApiClient`. Every component depends on the interface, not on `fetch`.

## `<SettingsPage>`

Admin form backed by `GET/PUT /settings` and `POST /test-connection`. Renders provider credentials, per-feature model/instruction overrides, and a probe button that surfaces `test-connection` results inline.

```tsx
<SettingsPage
  client={client}
  heading="AI Settings"
  providers={['openai', 'anthropic', 'ollama']}
/>
```

| Prop        | Type                      | Default                                    | Notes                                              |
|-------------|---------------------------|--------------------------------------------|----------------------------------------------------|
| `client`    | `AiApiClient`             | —                                          | Required.                                          |
| `providers` | `string[]`                | `['openai', 'anthropic', 'ollama']`        | Options rendered in the provider dropdown.         |
| `heading`   | `string`                  | —                                          | Optional heading rendered above the form.          |

Behaviour worth knowing:

- **Never emits the stored key.** The API returns `api_key_present: boolean`, not the plaintext key. The password input renders empty by default so a user can leave it blank to keep whatever's already stored.
- **Provider switch is safe.** Changing provider clears the typed key + last probe result so an OpenAI key never silently ships to an Ollama base URL.
- **422 errors render inline.** Field-level messages from the `{ errors: Record<string, string[]> }` envelope render under the offending input; a network error (or other non-422 failure) renders in the top alert with the `alert-error` styling instead of the green success one.

## `<UsageDashboard>`

Aggregated dashboard backed by `GET /usage`. Renders totals, per-feature breakdown, and daily buckets.

```tsx
<UsageDashboard
  client={client}
  from="2026-07-01"
  to="2026-07-31"
  refreshInterval={15_000}
  heading="Usage"
/>
```

| Prop              | Type          | Default | Notes                                                                                              |
|-------------------|---------------|---------|----------------------------------------------------------------------------------------------------|
| `client`          | `AiApiClient` | —       | Required.                                                                                          |
| `from`            | `string`      | —       | ISO date (`YYYY-MM-DD`). Forwarded to `/usage` as a query param.                                   |
| `to`              | `string`      | —       | ISO date (`YYYY-MM-DD`). Forwarded to `/usage` as a query param.                                   |
| `refreshInterval` | `number`      | `0`     | Poll interval in milliseconds. `0` disables polling. `15000` matches the Livewire dashboard cadence.|
| `heading`         | `string`      | —       | Optional heading rendered above the dashboard.                                                     |

Behaviour worth knowing:

- **Sequence-guarded polling.** Every fetch increments an internal request counter; only the most recent response updates state. Under slow networks (`fetch` latency > `refreshInterval`), a stale response can't overwrite a fresher one.
- **Reloads on prop change.** Passing controlled `from`/`to` values from a date-range picker just works — the dashboard reloads automatically.

## `<FeatureToggles>`

Per-feature enable/disable list backed by `GET /features` and `POST /features/{key}/toggle`. Each row optimistically flips its own switch and rolls back on API failure.

```tsx
<FeatureToggles
  client={client}
  heading="Features"
  onToggle={(feature) => console.log(feature)}
/>
```

| Prop       | Type                                                                | Notes                                                                          |
|------------|---------------------------------------------------------------------|--------------------------------------------------------------------------------|
| `client`   | `AiApiClient`                                                       | Required.                                                                      |
| `heading`  | `string`                                                            | Optional heading — kept visible in loading, empty, and error states.           |
| `onToggle` | `(feature: { key; package; enabled }) => void`                      | Fired after a successful toggle. Not fired on rollback.                        |

Behaviour worth knowing:

- **Optimistic + reversible.** The switch flips immediately; only if the POST rejects does the row roll back and surface an error banner. A subsequent successful toggle clears the banner.
- **Empty state keeps context.** When no features are registered, the heading still renders above the "No AI features registered." message.

## `useStreamingText`

Hook for consuming a long-running `fetch` response body as a UTF-8 text stream — useful for the AI usage dashboard's long-running agent-output surface, chain-of-thought output, or any streamed generation.

```tsx
import { useStreamingText } from '@artisanpack-ui/react/ai';

function AgentOutput({ agentUrl }: { agentUrl: string }) {
  const { text, streaming, error, start, stop, reset } = useStreamingText();

  return (
    <div>
      <button onClick={() => start(agentUrl)} disabled={streaming}>
        Run
      </button>
      <button onClick={stop} disabled={!streaming}>
        Stop
      </button>
      <button onClick={reset}>Clear</button>
      <pre>
        {text}
        {streaming && '…'}
      </pre>
      {error && <span role="alert">{error.message}</span>}
    </div>
  );
}
```

The hook uses the browser Streams API + an `AbortController`. It aborts the in-flight stream automatically on unmount, and rapidly re-calling `start()` cleanly cancels the previous stream without a race — a stale finally block will never flip `streaming` back to `false` while a newer stream is still reading.

> **Note:** `useStreamingText` is a client-side consumer, not a wire protocol. The `artisanpack-ui/ai` package's public REST surface does not include a streaming route — you point the hook at whatever URL your own app exposes (e.g. a custom controller that returns a `StreamedResponse`).

## Exported types

Every wire-level type mirrors the ai package's OpenAPI schema:

- `AiApiClient`, `AiApiError`
- `AiCredentials`, `AiSettingsResponse`, `AiSettingsUpdate`, `AiFeatureOverride`
- `AiFeature`
- `AiConnectionTestResult`
- `AiUsageResponse`, `AiUsageTotals`, `AiUsageByFeature`, `AiUsageDaily`
- `AiValidationError`

Import them from `@artisanpack-ui/react/ai` if you write your own client or components.

## Related

- [artisanpack-ui/ai](https://github.com/ArtisanPack-UI/ai) — the Laravel package that ships the REST endpoints
- [artisanpack-ui/vue](https://github.com/ArtisanPack-UI/vue) — Vue port of the same surface
