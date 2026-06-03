# 🛡️ Security Policy

We take security and data privacy seriously. As an offline-first Socratic learning platform, we want to ensure all student data cached in our local `IndexedDB` instance (via Dexie.js) remains fully isolated, and any cloud interfaces are robust and protected.

---

## Supported Versions

The following versions of **SahAI for Shiksha** are currently supported with security updates:

| Version | Status |
| :--- | :--- |
| `1.0.x` (Next.js PWA) | Supported (Active development) |
| `< 1.0.0` (Vanilla HTML) | EOL / Deprecated |

---

## 📬 Reporting a Vulnerability

**Please do not open a public GitHub issue for security-sensitive bugs or vulnerability discoveries.** 

To report a vulnerability:
1. Send an email to **asadityasharma190907@gmail.com** (or your designated security address).
2. Include a detailed description of the potential exploit, steps to reproduce it, and the potential impact (e.g. data leak, UI hijacking).

---

## ⚙️ Our Response Process

- **Acknowledgement:** We will acknowledge receipt of your vulnerability report within **48 hours**.
- **Investigation:** We will investigate and attempt to reproduce the issue in an isolated sandbox environment.
- **Resolution:** If confirmed, we will coordinate a fix and release a patched version of the code. We aim to resolve all high-priority issues within **14 business days**.
