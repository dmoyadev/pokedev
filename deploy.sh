#!/usr/bin/env sh

# Get the commit deployment message
default="🚀 Deploy $(date +'%Y%m%d%H%M%S')";
read -p "Enter the deployment commit message [$default]:" message

if [ -z "$message" ]; then
	message="$default"
fi

# Abort on errors
set -e

# build
npm run build

# Adding the deployment folder
git add -f dist
git commit -m "$message"
git subtree push --prefix dist origin gh-pages
