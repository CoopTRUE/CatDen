#!/bin/bash

git pull -f origin master
pnpm install
pnpm build
pm2 reload all
pm2 save
