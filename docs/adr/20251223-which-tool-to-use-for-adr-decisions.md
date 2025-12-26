# Which tool to use for ADR decisions

- Status: accepted
- Date: 2025-12-22
- Tags: adr,documentation,log4brains

## Context and Problem Statement

How to keep track of design decisions?

## Decision Drivers

- should be close to the code
- should be searchable
- should also have a human-readable version

## Considered Options

- [Log4brains](https://github.com/thomvaill/log4brains): architecture knowledge base (command-line + static site generator)
- [ADR Tools](https://github.com/npryce/adr-tools): command-line to create ADRs
- [ADR Tools Python](https://bitbucket.org/tinkerer_/adr-tools-python/src/master/): command-line to create ADRs
- [adr-viewer](https://github.com/mrwilson/adr-viewer): static site generator
- [adr-log](https://adr.github.io/adr-log/): command-line to create a TOC of ADRs

## Decision Outcome

Chosen option: log4brains,  because it is close to the code, searchable, supports multiple projects and has a human-readable form.
