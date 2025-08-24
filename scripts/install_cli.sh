#!/bin/zsh

install_cli() {
    print_step "Creating installation directory..."
    mkdir -p "$INSTALL_DIR"

    print_step "Compiling project..."
    deno compile -A --output "$INSTALL_DIR/dumb-cli" main.ts
    print_success "Compilation complete!"

    chmod +x "$INSTALL_DIR/dumb-cli"

    if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
        print_step "Adding $INSTALL_DIR to your PATH..."
        echo "" >> "$HOME/.zshrc"
        echo "# Added by dumb installer" >> "$HOME/.zshrc"
        echo "export PATH=\"\$HOME/bin:\$PATH\"" >> "$HOME/.zshrc"
        print_warning "Please restart your terminal or run: source ~/.zshrc"
    fi
}
