#!/usr/bin/env sh

# Abort on errors
set -e

# Get the commit deployment message
default="🚀 Deploy $(date +'%Y%m%d%H%M%S')";
read -p "Enter the deployment commit message [$default]:" message

if [ -z "$message" ]; then
	message="$default"
fi

# Build the project
npm run build

# Navigate into the build output directory
cd dist

# Allow to work with history mode in Vue Router
cp index.html 404.html

echo 'pokedev.danimoya.es' > CNAME

git init
git add -A
git commit -m "$message"

# Actual deployment in GitHub Pages
git push -f git@github.com:dmoyadev/pokedev.git main:gh-pages

cd -
