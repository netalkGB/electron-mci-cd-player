# Vite Project

This project is a setup using Vite, React, and Electron.

## How to Start

1. Install the dependencies:

    ```bash
    npm install
    ```

2. Start the development server:

    ```bash
    npm run dev
    ```

3. Launch the Electron app:

    Once the Vite server is running, the Electron application will launch with `dist-electron/main/main.js` as the entry point.

## Scripts

This project includes several npm scripts for common tasks:

- **`npm run dev`**: Starts the Vite development server. This allows you to develop your React application with live updates and hot module replacement.
  
- **`npm run build`**: Builds the project for production. It runs the `script/build.mjs` script, which handles building both the Vite frontend and the Electron app.

- **`npm run lint`**: Runs ESLint to check the code for syntax and style issues, ensuring code quality.

- **`npm run lint-fix`**: Runs ESLint with the `--fix` option, which automatically fixes fixable issues in the code.

- **`npm run preview`**: Starts a local server to preview the built project. This is useful for checking the app before deployment.

- **`npm run clean`**: Runs the `script/clean.mjs` script to clean up build artifacts and temporary files, helping to keep the project tidy.
