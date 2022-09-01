#!/usr/bin/env sh

# Abort on errors
set -e

# Get the commit deployment message
default="🚀 Deploy $(date +'%Y%m%d%H%M%S')";
read -p "Enter the deployment commit message [$default]:" message

if [ -z "$message" ]; then
	message="$default"
fi

# build
npm run build

# navigate into the build output directory
cd dist

git init
git add -A
git commit -m "$message"

# if you are deploying to https://<USERNAME>.github.io
git push -f git@github.com:dmoyadev/pokedev.git main:gh-pages

cd -
