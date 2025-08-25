# Dumb CLI

Dumb CLI is a command-line tool that interprets natural language prompts and
executes them as shell commands. It can handle multi-step logic, making your
workflow easier and more intuitive.

---

## Example Usage

```
dumb find the name of the .md file and echo count the number of lines that is present in that file. After that divide the number of lines output by 7
```

**Generated command:**

```
md_file=$(find . -name "*.md" -print -quit)
echo "$md_file"
line_count=$(wc -l <"$md_file" | awk '{print $1}')
echo "$line_count"
echo $((line_count / 7))
Do you want to execute this command? (y/N): y
Executing command...
./README.md
154
22
```

---

## Features

- Run shell commands using natural language descriptions
- Multi-step logic execution
- Command preview and confirmation
- Easy cancellation for safety

---

## Requirements

- [Deno](https://deno.land/#installation)
- Gemini API key ([How to create one](#creating-a-gemini-api-key))

---

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/fadedblack/dumb.git
   cd dumb
   ```
2. Set up git hooks (for development):
   ```bash
   git config core.hooksPath .githooks
   ```
3. Run the installation script:
   ```bash
   ./install.sh
   ```
   - The installer will prompt for your Gemini API key and store it in
     `~/.config/dumb/config.json`.
   - It will compile the Deno project and install the binary to `~/bin`.
   - Adds the installation directory to your PATH if needed.

---

## Creating a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Navigate to the API Keys section.
4. Click "Create API Key" and follow the instructions.
5. Copy your new API key and keep it safe.

---

## Configuration

- Configuration is stored in `~/.config/dumb/config.json` (permissions: 600)
- Contains your Gemini API key and other settings

---

## Interactive Mode

For a more interactive experience, add this function to your `~/.zshrc`:

```zsh
function dumb() {
    if [ $# -eq 0 ]; then
        echo "Usage: dumb <your command>"
        echo "Example: dumb 'create a branch and change into that branch'"
        return 1
    fi
    local input_string="$*"
    local output
    local confirm
    output=$(dumb-cli "$input_string")
    echo "Generated command:"
    echo "$output"
    echo -n "Do you want to execute this command? (y/N): "
    read -q confirm
    echo ""
    if [[ $confirm == "y" ]]; then
        echo "Executing command..."
        eval "$output"
    else
        echo "Command execution cancelled"
    fi
}
```

After adding this function:

1. Source your `~/.zshrc`: `source ~/.zshrc`
2. Use it like this:
   ```zsh
   dumb "create a new branch named feature and switch to it"
   # It will show you the command and ask for confirmation
   ```

---

## Uninstallation

To uninstall Dumb CLI, simply run:

```bash
./uninstall.sh
```

This will remove the binary and configuration files. Follow any instructions
shown after running the script.
