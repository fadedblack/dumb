#!/bin/zsh

: ${GREEN:='\033[0;32m'}
: ${BLUE:='\033[0;34m'}
: ${YELLOW:='\033[1;33m'}
: ${NC:='\033[0m'}
: ${BOLD:='\033[1m'}

: ${CONFIG_DIR:="$HOME/.config/dumb"}
: ${CONFIG_FILE:="$CONFIG_DIR/config.json"}
: ${INSTALL_DIR:="$HOME/bin"}

if ! typeset -f print_step >/dev/null; then
    print_step() {
        printf "${BLUE}=>${NC} ${BOLD}%s${NC}\n" "$1"
    }
fi

if ! typeset -f print_success >/dev/null; then
    print_success() {
        printf "${GREEN}✓${NC} %s\n" "$1"
    }
fi

if ! typeset -f print_warning >/dev/null; then
    print_warning() {
        printf "${YELLOW}!${NC} %s\n" "$1"
    }
fi
