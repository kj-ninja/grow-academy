#!/bin/bash

# Function to convert kebab-case to PascalCase
convert_to_pascal_case() {
    echo "$1" | awk -F'-' '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) substr($i,2)} 1' OFS=''
}

# Check if component name is provided
if [ -z "$1" ]; then
    echo "Error: No component name provided."
    exit 1
fi

# Component name in kebab-case
component_name_kebab=$1

# Run the bunx command to add the component
bunx shadcn@latest add "$component_name_kebab"

# Path to the component directory
component_directory="./src/components/ui"

# Convert the component name to PascalCase
component_name_pascal=$(convert_to_pascal_case "$component_name_kebab")

# Renaming the component directory and the .tsx file
new_file_path="$component_directory/$component_name_pascal.tsx"
mv "$component_directory/$component_name_kebab.tsx" "$new_file_path"

# Add the renamed file to Git
git add "$new_file_path"

# Run Prettier to format the new file
prettier --write "$new_file_path"

echo "Component $component_name_kebab renamed to $component_name_pascal and processed. Happy coding!"

