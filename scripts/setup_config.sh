#!/bin/zsh

setup_config() {
    print_step "Creating configuration directory..."
    mkdir -p "$CONFIG_DIR"

    if [ ! -f "$CONFIG_FILE" ]; then
        print_step "Setting up configuration..."
        
        # ZSH-compatible read commands
        echo -n "${YELLOW}?${NC} Please enter your API key: "
        read api_key
        
        echo -n "${YELLOW}?${NC} Enter the model (default: gemini-2.5-flash): "
        read model
        model=${model:-gemini-2.5-flash}
        
        echo -n "${YELLOW}?${NC} Enter the model name (default: Gemini): "
        read model_name
        model_name=${model_name:-Gemini}
        
        cat > "$CONFIG_FILE" << EOL
{
  "api_key": "$api_key",
  "model": "$model",
  "model_name": "$model_name"
}
EOL
        print_success "Configuration stored successfully!"
    else
        print_warning "Configuration file already exists."
    fi

    chmod 600 "$CONFIG_FILE"
}
