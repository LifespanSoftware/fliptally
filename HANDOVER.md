# Handover

Notes for picking this project back up in a new session. Not user-facing — update or
delete sections as they go stale.

## Repo status (as of 2026-11-24)

- `main` is clean and fully pushed: `3571419` is the latest commit, matches
  `origin/main`.
- Repo is currently `christopherdally/fliptally`, **public**, owned by the personal
  account `christopherdally` (not an org).

## Pending: transfer to the `lifespan-software` org

The owner wants this repo moved from the personal `christopherdally` account into the
`lifespan-software` GitHub organisation, staying **public**. This session's GitHub access
is repo-scoped and the transfer API is blocked by the proxy, so **Claude cannot do this
step** — it needs to be done by hand on github.com:

```
Settings → Danger Zone (bottom of page) → Transfer ownership → type "lifespan-software" → confirm
```

Visibility (public) carries over automatically. Once done, update the git remote on any
local clones (`git remote set-url origin https://github.com/lifespan-software/fliptally`)
and double check `README.md` / `LICENSE` / in-app links don't hardcode the old owner path
anywhere.

## Recent work

- Added `LICENSE` (proprietary, all rights reserved, Lifespan Software) and
  `package.json` `"license": "UNLICENSED"`.
- Added an in-app **Terms of use & licence** page (`src/app/terms/page.tsx`), linked from
  **Me**.
- Added `ai_rules.md`: version numbers should bump **at most once per day**, even if
  multiple changes ship that day — batch same-day changes under one bump.

## Open items

- Confirm the org transfer above once completed.
