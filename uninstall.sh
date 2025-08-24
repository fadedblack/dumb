#!/bin/bash

RED='\033[31m'
BOLD='\033[1m'
RESET='\033[0m'

set -e

if [ -f "$HOME/bin/dumb" ]; then
  rm "$HOME/bin/dumb"
  echo "Removed binary: $HOME/bin/dumb"
else
  echo "Binary not found: $HOME/bin/dumb"
fi

if [ -d "$HOME/.config/dumb" ]; then
  rm -rf "$HOME/.config/dumb"
  echo "Removed configuration: $HOME/.config/dumb"
else
  echo "Configuration not found: $HOME/.config/dumb"
fi

echo -e "${RED}Dumb CLI has been uninstalled.${RESET}"
echo -e "Sorry to see you go. 👋😢"
echo -e "${BOLD}Please restart your terminal or run: source ~/.zshrc${RESET}"
