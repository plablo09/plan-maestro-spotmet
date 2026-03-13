# Specification: Deployment Automation & CI/CD

## Goal
Automate the deployment process of the 'Plan Maestro Spotmet' app (and future experimental apps) to a remote Ubuntu server using Docker, GHCR, and GitHub Actions.

## Architecture
- **Reverse Proxy:** Caddy (running in a standalone container) handling HTTPS via Let's Encrypt.
- **Container Registry:** GitHub Container Registry (GHCR).
- **CI/CD:** GitHub Actions.
- **Deployment:** SSH-based trigger to pull new images and restart containers via Docker Compose.
- **Networking:** A shared Docker network named `gateway` for inter-container communication.

## Security Requirements
- Dedicated `deploy` user on the server.
- SSH Key-only authentication for the `deploy` user.
- Secrets managed via GitHub Repository Secrets.
- No exposed ports except 80 and 443 (via Caddy).
