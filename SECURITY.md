# Security Policy

## Scope

This repository is the public-facing leaderboard layer of the HackJudge ecosystem. Security reports may involve the React/Vite client, Supabase integration, realtime subscriptions, data exposure, ranking integrity, or deployment configuration.

## Reporting a vulnerability

Please report suspected vulnerabilities privately to the maintainer through a trusted direct communication channel. Do not open a public issue for undisclosed security problems.

Include:

- affected file, route, or component;
- clear reproduction steps;
- potential impact;
- screenshots, logs, or proof of concept where safe;
- suggested remediation, if known.

Do not include real credentials, private participant information, or production data in the report.

## Priority areas

Please report urgently:

- exposure of Supabase service-role keys or other secrets;
- Row Level Security bypasses;
- unauthorized access to participant or judging data;
- ranking or score manipulation;
- injection or malicious content rendering;
- denial-of-service risks against shared infrastructure;
- leakage of sensitive errors or configuration values.

## Secure development requirements

- Browser-exposed Supabase keys must be treated as public and constrained by Row Level Security.
- Never place service-role keys, database passwords, or administrative secrets in frontend code.
- Validate and normalize data received from Supabase before rendering it.
- Avoid trusting client-side ranking, identity, or authorization signals for privileged decisions.
- Keep dependencies current and review security advisories.
- Do not log secrets, access tokens, or personal participant data.

## Response process

Reports will be triaged for validity, severity, affected components, and remediation options. The maintainer may request additional reproduction details and will coordinate disclosure after a fix or mitigation is available.

## Disclaimer

The project is provided as-is. Deployers remain responsible for Supabase policies, environment configuration, monitoring, rate limits, backups, and production hardening.
