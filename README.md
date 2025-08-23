## Dumb CLI

**Dumb CLI** is a command-line tool that allows you to run shell commands by
simply providing a description of what you want to do. Instead of remembering
exact command syntax, just describe your intent and Dumb CLI will execute the
appropriate command for you.

### Setup

- Inorder to setup this project into local machine, you need setup hooks.

```bash
git config core.hooksPath .githooks
```

- The above code will configure hooks.

### Features

- Run shell commands using natural language descriptions
- Simplifies command-line usage for beginners and power users
- Saves time by reducing the need to look up command syntax

### Example Usage

```sh
dumb "List all files in the current directory"
dumb "Show disk usage for the home folder"
```

### Getting Started

1. Install Dumb CLI (instructions coming soon)
2. Run `dumb "your command description"`

### Project Structure

```
src/
  main.ts        # Entry point for Dumb CLI

test/
  main_test.ts   # Basic test for CLI entry point

deno.json        # Deno configuration and tasks
README.md        # Project documentation
```

### License

MIT
