---
title: 'Writing TinyKV: A Key Value Store in C++'
createdAt: 2026-02-09T17:11:44.647Z
updatedAt: 2026-02-10T17:11:51.069Z
---

## Motivation

I wrote this key-value store as an introductory project to C++. I was inspired by a friend and decided to implement it myself. You can check out his blog post [here](https://mraihan.dev/blog/LSM-tree-Key-Value-Store-in-CPP).

## High-Level Design![](</images/Screenshot 2026-03-12 at 10.27.42 PM.png>)

## Key Components

### MemTable

### Write-Ahead Log (WAL)

The WAL is essential for ensuring durability. Every write is immediately appended to the WAL. Only after memTable.flush() is the WAL cleared. If the database crashes, the WAL will be replayed on startup to build the memtable.

### SSTable

The core data structure on disk is the SSTable. An SSTable is really just a file that stores sorted 

**TODO:**

1. Motivation
2. Architecture (LSM-Tree Key Value Store)
3. Components and the role they play
4. Future features (actual memory management / benchmarking and optimization - when is the “right” time to bench and optimize? /  concurrency handling / making it distributed)
5. SSTable disk layout (Part II: Implementation Details)
6. Memory management (Part II: Implementation Details)
7. Iterators (Part II: Implementation Details)
