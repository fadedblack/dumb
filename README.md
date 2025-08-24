## Dumb CLI

**Dumb CLI** is a command-line tool that allows you to run shell commands by
simply providing a description of what you want to do. Instead of remembering
exact command syntax, just describe your intent and Dumb CLI will execute the
appropriate command for you.

### Getting Started

1. Follow the [Installation](#installation) instructions below.
2. If you haven't created a Gemini API key yet, see [Creating a Gemini API Key](#creating-a-gemini-api-key).
3. Run `dumb "your command description"`.

### Requirements

- [Deno](https://deno.land/#installation) must be installed on your system
- Gemini API key (for LLM features)
  - If you haven't created a Gemini API key yet, see [Creating a Gemini API Key](#creating-a-gemini-api-key)

### Creating a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Navigate to the API Keys section.
4. Click on "Create API Key" and follow the instructions.
5. Copy your new API key and keep it safe.

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/fadedblack/dumb.git
   cd dumb
   ```

2. Set up git hooks (required for development):
   ```bash
   git config core.hooksPath .githooks
   ```

3. Run the installation script:
   ```bash
   ./install.sh
   ```

   The installer will:
   - Ask for your API key and store it securely in `~/.config/dumb/config.json`)
   - Compile the Deno project
   - Install the binary to `~/bin`
   - Add the installation directory to your PATH (if needed)

### Configuration

The tool stores its configuration in:

- `~/.config/dumb/config.json` - Contains your API key
- Configuration file permissions are set to 600 (readable only by you)

### Features

- Run shell commands using natural language descriptions
- Simplifies command-line usage for beginners and power users
- Saves time by reducing the need to look up command syntax

### Example Usage

```sh
dumb "List all files in the current directory"
dumb "Show disk usage for the home folder"
```

### Uninstallation

To uninstall Dumb CLI, simply run the provided uninstall script:

```bash
./uninstall.sh
```

This will remove the binary and configuration files. Follow any instructions shown after running the script.

### Project Structure

```
src/
  main.ts        # Entry point for Dumb CLI

test/
  main_test.ts   # Basic test for CLI entry point

deno.json        # Deno configuration and tasks
README.md        # Project documentation
```
