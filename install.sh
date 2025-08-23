#!/bin/bash

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' 
BOLD='\033[1m'

print_step() {
    echo -e "${BLUE}=>${NC} ${BOLD}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}!${NC} $1"
}

CONFIG_DIR="$HOME/.config/dumb"
CONFIG_FILE="$CONFIG_DIR/config.json"
INSTALL_DIR="$HOME/bin"

print_step "Creating directories..."
mkdir -p "$CONFIG_DIR"
mkdir -p "$INSTALL_DIR"

if [ ! -f "$CONFIG_FILE" ]; then
    print_step "Setting up API key configuration..."
    read -p "$(echo -e "${YELLOW}?${NC} Please enter your API key: ")" api_key
    echo "{\"api_key\": \"$api_key\"}" > "$CONFIG_FILE"
    print_success "API key stored successfully!"
else
    print_warning "API key already exists in configuration."
fi

chmod 600 "$CONFIG_FILE"

print_step "Compiling project..."
deno compile -A --output "$INSTALL_DIR/dumb" main.ts
print_success "Compilation complete!"

chmod +x "$INSTALL_DIR/dumb"

if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
    print_step "Adding $INSTALL_DIR to your PATH..."
    echo "" >> "$HOME/.zshrc"
    echo "# Added by dumb installer" >> "$HOME/.zshrc"
    echo "export PATH=\"\$HOME/bin:\$PATH\"" >> "$HOME/.zshrc"
    print_warning "Please restart your terminal or run: source ~/.zshrc"
fi

echo -e "\n${GREEN}✨ Installation complete!${NC}"
echo -e "${BOLD}You can now use the '${BLUE}dumb${NC}${BOLD}' command from anywhere.${NC}"
