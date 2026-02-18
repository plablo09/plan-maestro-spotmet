# Spotmet Compliance 3D Visualization

## Development Workflow

### Branching Strategy
- `main`: Production-ready code.
- `feat/*`: New features.
- `fix/*`: Bug fixes.
- `chore/*`: Infrastructure and maintenance.

### Contribution Process
1. Create a new branch from `main`.
2. Implement changes following the project's code style guides (`conductor/code_styleguides/`).
3. Add tests for new functionality.
4. Ensure all tests pass locally (`pytest` and `npm test`).
5. Open a Pull Request (PR) to `main`. CI will automatically run tests.
6. PRs must be merged using the GitHub CLI or web interface.
