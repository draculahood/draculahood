# Draculahood

Draculahood — Sign the castle ledger, pick your crest and keep the count company on Robinhood Chain.

## The problem

Memecoin sites are usually a logo, a buy button and promises. There is nothing to do on them, nothing anyone can check, and a
community has no shared place that outlives a feed of posts.

## The solution

Draculahood is a vampire memecoin ($DRACULA) with a small, honest castle around it: a 3D castle hall to walk through, a
public on-chain guestbook (the Coven Ledger), a vampire portrait maker and live Robinhood Chain data. The token promises no
value and no returns; the tools work without it.

## How it works

- **Castle hall** (`/`): a WebGL hall drawn in code (three.js). Scrolling walks the camera down the hall while the
  count (the project's vampire artwork on a billboard) floats beside each room. Without WebGL the page falls back to a flat background.
- **Coven Ledger** (`/coven`): the `DraculahoodCovenBook` contract stores one entry per wallet — a nickname (1–24 printable
  ASCII characters) and one of eight crests — and lets the wallet change it. No owner, no fee, no token, nothing payable.
  Until the contract address is set in `src/config/contracts.ts`, the page runs in practice mode (a free wallet signature
  kept in the browser).
- **Night Clock**: countdown to your next local midnight next to the live Robinhood Chain block, gas, ETH / USD (Chainlink)
  and transactions per block.
- **Portraits** (`/pfp`): a vampire profile picture from parts, exported as PNG or WebP in the browser.
- **Token** (`/token`): contract address, live supply and Pons bonding-curve data once the token launches.

## What you can try

Live now: the castle hall, the Night Clock, the portrait maker, the Coven Ledger on Robinhood Chain (one transaction from
your wallet, gas only), wallet connect (adds Robinhood Chain to your wallet).
Coming later: $DRACULA on Pons. Lore contests and a lore
archive are planned ideas only.

## Run it locally

Node 20+.

```bash
npm install
npm run build
npm run start        # http://localhost:5790
```

No environment variables are required. Optional ones (put them in `.env.local` locally or in the Vercel project settings):

| Name | Use |
| --- | --- |
| `ROBINHOOD_RPC_URL` | Server RPC for Robinhood Chain (default: the public endpoint) |
| `NEXT_PUBLIC_ROBINHOOD_RPC_URL` | Browser RPC (default: the public endpoint) |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Enables the WalletConnect option (project id from cloud.reown.com) |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Shared store for the relay rate limits (in-memory without it) |
| `TRUST_PROXY_HEADERS` | `1` behind a trusted proxy so client IPs are read from forwarded headers |

Tests:

```bash
npm test                     # site logic: relay rules, rate limits, nickname rules, art, ABI vs build
cd contracts && ./setup.sh && forge test --no-match-path 'test/fork/*'
forge test --match-path 'test/fork/*' --fork-url https://robinhood.drpc.org --evm-version cancun
```

The Coven Ledger contract is live at `0x52e7229001f29f1f98a6e305df55884376bc3eda` (address in
`src/config/contracts.ts`). Check that the deployed bytecode matches this source:

```bash
npm run verify-deployment -- --book <address> --book-tx <creation tx>
```

## Network in your wallet

Robinhood Chain · chain id 4663 · gas in ETH · RPC https://rpc.mainnet.chain.robinhood.com · explorer
https://robinhoodchain.blockscout.com. The Connect button adds it for you. Phantom cannot add custom networks and is shown
as not supported.

## Project layout

```
contracts/            Foundry: DraculahoodCovenBook + unit, fuzz, invariant and fork tests
scripts/              artifact generator and verify-deployment
src/app/              pages and API routes (/api/chain live facts, /api/rpc read-only relay)
src/components/       castle scene, wallet, ledger, portrait maker
src/config/           brand.ts (name, ticker, CA, links), contracts.ts, assets.ts
src/content/castle.ts all long copy
src/lib/              chain client, relay rules, nickname rules, art (crests, vampire, mark)
```

## Contracts and token

- `DraculahoodCovenBook`: `0x52e7229001f29f1f98a6e305df55884376bc3eda` on Robinhood Chain, source verified on
  https://robinhoodchain.blockscout.com.
- `$DRACULA`: 0xe7e87a25c9e2f7762ceaaf2ff07accf701279b71 on Pons (live since 28 Oct 2026).

## Security and status

Early release. The contract is immutable and holds no funds; it has a written self-review and the test suite above, but
no independent review yet. Names in the ledger are free text written by anyone; the site masks names that trip a small word
filter, the chain keeps the original. $DRACULA is a memecoin with no promised value.

## Contributing

Issues and pull requests are welcome. Download the ZIP or fork the repository, keep changes small, run `npm test`,
`npx tsc --noEmit` and the Foundry tests before opening a pull request.

## License

MIT — see `LICENSE`.
