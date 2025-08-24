#!/bin/zsh

set -e

SCRIPT_DIR=${0:A:h}

. "${SCRIPT_DIR}/scripts/utils.sh"
. "${SCRIPT_DIR}/scripts/setup_config.sh"
. "${SCRIPT_DIR}/scripts/install_cli.sh"

{
    setup_config
    install_cli
} || {
    print_warning "Installation failed!"
    exit 1
}

print_success "✨ Installation complete!"
print_success "You can now use the 'dumb-cli' command from anywhere."
