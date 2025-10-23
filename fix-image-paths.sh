#!/bin/bash

# Script to fix image paths in all blog posts
# Changes /assets/ to assets/ (relative path)

echo "Fixing image paths in blog posts..."

# Find all index.md files in blog/posts subdirectories
find blog/posts -name "index.md" -type f | while read -r file; do
    # Check if file contains /assets/ paths
    if grep -q "](/assets/" "$file" || grep -q "](/assets/" "$file"; then
        echo "Fixing: $file"
        # Use sed to replace /assets/ with assets/ (without leading slash)
        # macOS sed requires -i with empty string for in-place editing
        sed -i '' 's|](/assets/|](assets/|g' "$file"
    fi
done

echo "Done! All image paths have been updated."
