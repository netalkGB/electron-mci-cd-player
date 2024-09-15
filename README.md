# Electron MCI CD Player

`electron-mci-cd-player` is an Electron application that provides CD player functionality. The application uses a native extension to call the Media Control Interface (MCI) for playing CDs from within the Electron environment. This project is developed using Electron and React.

## Prerequisites

To use this project, you need the following:

- **Visual Studio 2022**: Required for building a program using C++.
- **CMake**: Must be installed to build the necessary components.

## Installation

To install dependencies, run:

    npm run setup

## Development

To start the application in development mode, run:

    npm run dev

This will launch the development environment using Electron and React.

## Code Linting

To lint the code, run:

    npm run eslint

To automatically fix lint errors that can be corrected, run:

    npm run eslint:fix

## Build

To build the application and create the installer, run:

    npm run package

The installer will be generated in the `cd-player/release/${version}/` directory.

## Technologies Used

- **Electron**: A framework for building cross-platform desktop applications.
- **React**: A JavaScript library for building user interfaces.
- **Media Control Interface (MCI)**: Used via a native extension to enable CD playback within the Electron application.

## License

This project is licensed under the [MIT License](LICENSE).
