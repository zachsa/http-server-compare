---
layout: default
---

# HTTP(S) server: performance comparison

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Contents**

- [Concepts](#concepts)
  - [Managing sub-processes](#managing-sub-processes)
  - [Short-lived HTTP server gotchas](#short-lived-http-server-gotchas)
- [Setup](#setup)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Concepts
`SIGINT` - Signal interrupt
`SIGTERM` - Signal terminate

- What is a signal?
- Do these have to be handled by parent or child processes?

## Managing sub-processes

## Short-lived HTTP server gotchas

# Setup
```sh
# Install Node.js via NVM
# Install Golang
# Install Python

# Install Ruby and Jekyll
sudo apt update \
  && sudo apt install \
    rbenv \
    git \
    curl \
    libssl-dev \
    libreadline-dev \
    zlib1g-dev \
    autoconf \
    bison \
    build-essential \
    libyaml-dev \
    libreadline-dev \
    libncurses5-dev \
    libffi-dev \
    libgdbm-dev

rbenv install 3.2.2
rbenv global 3.2.2
bundle install
npm start
```

{% include charts.html %}
