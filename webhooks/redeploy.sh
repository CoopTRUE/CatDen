#!/bin/bash

git pull -f origin main
pnpm install
pnpm build
pm2 reload all
pm2 save
