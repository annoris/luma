# Contributing to LUMA Botanical Soda

Thank you for your interest in contributing to **LUMA Botanical Soda**! Whether you're fixing a subtle animation bug, crafting a brand-new botanical flavor, improving accessibility, or refining ambient audio interactions, your contributions help make this zero-dependency creative web experience even better.

---

## Philosophy

LUMA Botanical Soda is intentionally built as a **zero-dependency, static HTML/CSS/JS creative web experience**:

- **Zero runtime dependencies** — No bundlers, frameworks, or heavy build steps required.
- **Fast & accessible** — Smooth 60fps animations, responsive design across viewports, and thoughtful keyboard/screen-reader support.
- **Fork-friendly** — Anyone can clone, customize, and deploy instantly to GitHub Pages.

---

## Quickstart

### Prerequisites

- **Node.js `>= 18`** (used only for the local dev server and validation script — no `npm install` needed!)

### Run Locally

1. **Fork** the repository on GitHub and **clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/luma.git
   cd luma
   ```
2. **Start the local development server**:
   ```bash
   npm start
   ```
3. **Run the built-in validation suite** before committing:
   ```bash
   npm run check
   ```

---

## Ways to Contribute

- **New Botanical Flavors & Visuals**: Propose new flavor palettes, micro-interactions, or custom SVG/CSS art.
- **Audio & Sensory Polish**: Enhance ambient soundscapes or interactive audio cues while respecting user playback preferences.
- **Performance & Accessibility**: Optimize asset loading, reduce layout shift, improve ARIA labels, and support `prefers-reduced-motion`.
- **Bug Fixes**: Squash cross-browser quirks (Safari, Firefox, Chrome, mobile touch devices).
- **Documentation & Showcases**: Improve docs or share your fork/remix in Discussions or Issues.

---

## Coding Guidelines

1. **Keep it zero-dependency**: Avoid adding external npm packages or third-party runtime libraries.
2. **Clean, modern web standards**: Write semantic HTML5, modern CSS (custom properties, Flexbox/Grid, smooth transitions), and vanilla ES modules/JavaScript.
3. **Respect user preferences**: Honor `prefers-reduced-motion` and ensure audio never auto-plays without user interaction.
4. **Stay lightweight**: Optimize any images or audio assets you add under `assets/` so the experience remains snappy.
5. **Pass validation**: Always run `npm run check` and verify your changes in both desktop and mobile viewports.

---

## Pull Request Workflow

1. Create a descriptive branch from `main`:
   ```bash
   git checkout -b feat/my-awesome-flavor
   ```
2. Make your changes and test thoroughly with `npm start`.
3. Run `npm run check` and confirm there are zero errors.
4. Commit your changes with a clear, concise message (e.g., `feat: add hibiscus citrus flavor theme` or `fix: prevent audio overlap on rapid clicks`).
5. Push your branch and open a Pull Request using the repository's PR template.
   - Include **screenshots or short screen recordings** for visual or animation changes!

---

## Reporting Bugs & Requesting Features

- **Found a bug?** Open a [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md) with reproduction steps, browser/OS details, and screenshots if applicable.
- **Have an idea?** Open a [Feature Request](.github/ISSUE_TEMPLATE/feature_request.md) describing the inspiration and expected user experience.

---

## Community & Code of Conduct

All contributors and participants are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md). Let's keep this space welcoming, creative, and respectful for everyone.

---

## Support & Licensing

LUMA Botanical Soda is released under a **Proprietary / All Rights Reserved License** (see [LICENSE](LICENSE)). If you love the project, consider starring the repo or supporting development via the GitHub **Sponsor** button!
