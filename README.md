# Log (`@peter.naydenov/log`)

[![version](https://img.shields.io/github/package-json/v/peterNaydenov/log)](https://www.npmjs.com/package/@peter.naydenov/log)
[![license](https://img.shields.io/github/license/peterNaydenov/log)](#license)

A small logging system with a single point of control: filter messages by activity level and route them to any sink you want — the console, an external service, or your own logic.

- **Level-based filtering** — set a threshold once and messages above it are dropped.
- **Pluggable handler** — the default routes to `console`; swap in anything.
- **Zero dependencies**, works in Node, browsers, and bundlers.
- **TypeScript-ready** — ships with `.d.ts` declarations.

## Why?

You want debug messages during development but not in production. `log` lets you set one threshold to silence everything (`level: 0`) and tune verbosity without touching call sites.

It's also abstract enough to drive non-logging workflows — see [Alternative Ideas](#alternative-ideas).

## Installation

```bash
npm install @peter.naydenov/log
```

ESM:

```js
import createLog from '@peter.naydenov/log'
```

CommonJS:

```js
const createLog = require('@peter.naydenov/log')
```

## Quick start

```js
import createLog from '@peter.naydenov/log'

const log = createLog()                       // defaults → logs everything
const result = log({ message: 'hello' })
// console: [Debug]: hello
// result === '[Debug]: hello'                ← default handler returns the formatted string

// Silence everything
const silent = createLog({ level: 0 })
silent({ message: 'never logged' })           // -> null, nothing printed
```

## API

### `createLog(options?, logFunction?) → log`

Creates and returns a `log` function.

#### `options`

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `level` | `number \| string \| string[]` | `1000` | Threshold. Calls whose `level` is higher are ignored. Use `0` to silence everything (with the default handler). |
| `type` | `string` | `'log'` | Default message type. The default handler routes `'warn'` → `console.warn`, `'error'` → `console.error`, anything else → `console.log`. |
| `defaultMessageLevel` | `number \| string \| string[]` | `1` | Level applied when a call does not provide its own `level`. |

Any extra properties on `options` are forwarded to `logFunction` as part of each payload.

#### `logFunction`

```ts
type LogFunction = (payload: LogPayload) => unknown
```

Custom handler invoked for each call. Receives the merged payload (`options` defaults + per-call input, with `logLevel` injected). Its return value is propagated back to the caller of `log`, so it may return a `Promise`.

#### Return: `log(input)`

```ts
type LogInput = {
  message: string
  type?: string
  level?: number | string | string[]
  [key: string]: unknown
}

log(input: LogInput): unknown
```

| Field | Type | Description |
| --- | --- | --- |
| `message` | `string` | Required. The message text. |
| `level` | `number \| string \| string[]` | Per-call level. Falls back to `defaultMessageLevel`. |
| `type` | `string` | Per-call type override. Falls back to the `type` option. |
| `extra` | `unknown` | Any additional properties are forwarded to `logFunction`. |

Both `level` and `type` also accept `null` (or `undefined`), which means "not provided" and triggers the fallback.

## Activity levels

The default numeric scheme is straightforward:

- **Lower threshold = more verbose.** `level: 1000` (default) lets everything through; `level: 1` shows only the most important messages.
- **`level: 0` is silent** — the default handler treats it as a special "stop everything" signal and returns `null`.
- **Default message level is `1`** — most calls can omit `level` and still be processed.
- **`level: 0` is preserved** if you pass it explicitly on a call (it is *not* treated as missing).

### Custom schemes

Anything works as a level — numbers, strings, or arrays. Here's a string-based "verbosity" scheme:

```js
const log = createLog(
  {
    level: 'basic',
    defaultMessageLevel: ['basic', 'warning', 'all'],
  },
  ({ message, level, logLevel }) => {
    if (Array.isArray(level) && level.includes(logLevel)) return message
    return null
  }
)

log({ message: 'x', level: ['basic', 'warning', 'all'] })  // 'x'
log({ message: 'y', level: ['warning', 'all'] })           // null  — 'basic' not in list
log({ message: 'z' })                                     // 'z'   — defaultMessageLevel kicks in
```

## Message types

With the default handler, the `type` field routes to a specific `console` method:

- `'warn'` → `console.warn`
- `'error'` → `console.error`
- anything else (including the default `'log'`) → `console.log`

The default handler formats messages as `[Debug]: <message>` and also returns that string from the call. Custom handlers are free to ignore `type` entirely.

## TypeScript

The package ships with full type definitions in `dist/log.d.ts` — no `@types/...` package needed.

```ts
import createLog from '@peter.naydenov/log'
import type { LogFunction, LogInput, LogPayload } from '@peter.naydenov/log'

const log = createLog({ level: 5 })
log({ message: 'hi', level: 1 })                          // typed LogInput
```

Available exports: `LogLevel`, `CreateLogOptions`, `LogInput`, `LogPayload`, `LogFunction`.

## Alternative Ideas

Because the handler is just a function, you can drive any conditional workflow — not just logging. A common pattern is gating code by user role:

```js
let a = 'not changed'
const user = { role: 'guest' }

const roleSpecific = createLog(
  {
    defaultMessageLevel: ['admin', 'owner', 'guest'],
    level: user.role,
  },
  ({ level, logLevel, fn }) => {
    if (Array.isArray(level) && level.includes(logLevel)) return fn()
    return null
  }
)

roleSpecific({ level: ['admin', 'owner'], fn: () => (a = 'admin changed') })
// a === 'not changed'  — guest role not in the level list

roleSpecific({ level: ['guest'], fn: () => (a = 'guest changed') })
// a === 'guest changed'

roleSpecific({ fn: () => (a = 'general code') })
// a === 'general code'  — uses defaultMessageLevel
```

## Credits

`@peter.naydenov/log` was created and is maintained by Peter Naydenov.

## License

Released under the [MIT License](./LICENSE).
