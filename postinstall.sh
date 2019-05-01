#!/usr/bin/env bash

if [ -d public/polyfills ]; then
  rm -rf public/polyfills
fi

mkdir public/polyfills

KV_STORAGE_DIST=node_modules/kv-storage-polyfill/dist
cp $KV_STORAGE_DIST/kv-storage-polyfill.umd.js public/polyfills/
cp $KV_STORAGE_DIST/kv-storage-polyfill.mjs public/polyfills/kv-storage-polyfill.m.js