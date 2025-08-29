export const showHelp = (): void => {
console.log(`Dumb CLI - Help

Usage:
  dumb <your natural language command>

Example:
  dumb find the name of the .md file and echo count the number of lines that is present in that file. After that divide the number of lines output by 7

Features:

Interactive Mode:
Add the following function to your ~/.zshrc for interactive usage:

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

Keybindings:
  Add the following to your ~/.zshrc:

YELLOW='\\x1b[1;33m'
NC='\\x1b[0m'

_dumb_wrap_and_run() {
  if [[ -n "$BUFFER" ]]; then
    print ""
    echo -e "\${YELLOW}Converting to dumb command:\${NC} $BUFFER"
    zle reset-prompt
    eval "dumb $BUFFER"
    BUFFER=""
    zle reset-prompt
  else
    BUFFER="dumb "
    zle reset-prompt
  fi
}

zle -N _dumb_wrap_and_run
bindkey '^[d' _dumb_wrap_and_run

  1. Empty prompt: Press Option+D to start a new dumb command
  2. With existing text: Type your command and press Option+D to convert it with visual highlight

For more details, see the README.md.
`);
}