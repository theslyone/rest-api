#!/usr/bin/env bash
npm run build
docker build -t rest-api .
#docker run rest-api
