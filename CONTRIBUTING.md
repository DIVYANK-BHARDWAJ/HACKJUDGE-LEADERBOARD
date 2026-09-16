# Contributing to HackJudge Live Leaderboard

Thank you for helping improve the public standings layer of the HackJudge ecosystem.

## Project context

This repository is the leaderboard and visualization surface connected to:

1. **HACKJUDGE** — repository analysis and scoring engine.
2. **HACKJUDGE-PARTICIPANT-PORTAL** — submission intake, participant workflows, and organizer controls.
3. **leaderboard-** — live ranking, podium presentation, score visualization, and event countdown.

Changes should preserve clear boundaries between evaluation logic, orchestration, shared data, and presentation.

## Before you begin

- Read the README and SECURITY policy.
- Search existing issues and pull requests.
- Never commit credentials, private keys, Supabase service-role keys, or participant data.
- Confirm that changes are compatible with the shared Supabase schema and event lifecycle.

## Development workflow

```bash
git clone https://github.com/DIVYANK-BHARDWAJ/leaderboard-.git
cd leaderboard-
npm install
npm run dev
```

Before submitting a pull request:

```bash
npm run lint
npm run build
```

## Engineering standards

- Use TypeScript with explicit, understandable types.
- Keep ranking behavior deterministic and transparent.
- Preserve score ordering and podium correctness.
- Treat external data as untrusted and validate assumptions at boundaries.
- Avoid exposing sensitive data in UI, logs, or error messages.
- Clean up intervals, subscriptions, and listeners when components unmount.
- Consider loading, empty, error, stale-data, and malformed-data states.
- Maintain keyboard accessibility, contrast, and responsive behavior.
- Prefer small, focused commits and explain non-obvious decisions.

## Data and security expectations

The frontend uses Supabase client configuration and must rely on correctly configured Row Level Security policies. Do not add privileged database credentials to browser code. Do not weaken access controls to simplify development.

Any suspected vulnerability must be reported privately using `SECURITY.md`, not disclosed in a public issue.

## Pull request checklist

- [ ] The change has a clear purpose and scope.
- [ ] The README or relevant documentation is updated when behavior changes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Loading, empty, error, and realtime behavior were considered.
- [ ] No secrets or private participant information were added.
- [ ] Supabase access assumptions remain least-privilege.
- [ ] The change does not break the HackJudge ecosystem contract.
- [ ] Screenshots or a short demonstration are included for meaningful UI changes.

## Commit guidance

Use concise imperative messages, for example:

- `feat: add score history visualization`
- `fix: handle malformed leaderboard scores`
- `docs: clarify Supabase setup`
- `refactor: isolate ranking helpers`

## Review principles

Reviews prioritize correctness, fairness, security, accessibility, maintainability, and operational resilience over cosmetic complexity.

## License

By contributing, you agree that your contributions are provided under the repository's Apache License 2.0, subject to its terms.
