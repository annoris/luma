# Security Policy

## Supported Versions

The **LUMA — Botanical Soda Web Experience** team actively maintains and provides security updates for the latest release branch:

| Version | Branch | Supported |
| :--- | :--- | :---: |
| **1.0.x** | `main` | ✅ Yes |
| **< 1.0.0** | Legacy pre-release | ❌ No |

---

## Security Architecture Overview

- **Zero External Dependencies:** Built with 100% native HTML5, CSS3, Vanilla JS, and the browser's built-in Web Audio API (`0` npm dependencies).
- **Official Solana Treasury Verification:** The sole official Solana (`SOL` / `USDC-SPL`) payment and sponsorship wallet address associated with this project is:
  ```text
  3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm
  ```
  Always verify this exact address in [`PAYMENT.md`](../PAYMENT.md), [`SOURCE_ACCESS.md`](../SOURCE_ACCESS.md), [`SPONSORS.md`](../SPONSORS.md), and [`.github/FUNDING.yml`](./FUNDING.yml) before signing any transaction.

---

## Reporting a Vulnerability

Please report any security vulnerabilities privately via GitHub's **Private Vulnerability Reporting** tab under the repository's **Security** section rather than opening a public issue.
