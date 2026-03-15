---
title: 'Writing TinyKV: A Key Value Store in C++'
createdAt: 2026-02-09T17:11:44.647Z
updatedAt: 2026-03-11T17:11:51.069Z
---

## Motivation

I wrote this key-value store as an introductory project to C++. I was inspired by a friend and decided to implement it myself. You can check out his blog post [here](https://mraihan.dev/blog/LSM-tree-Key-Value-Store-in-CPP).

## High-Level Design

![](</images/Screenshot 2026-03-15 at 9.47.54 PM.png>)

## API

The key-value store has a simple API:

1. Put(key, val): If key already exists, then its value is overwritten with val. Otherwise, the new (key, val) pair is added to the system.
2. Get(key): Returns (key, val) if it exists and hasn't been deleted. Otherwise, raise a KeyError.
3. Del(key): Deletes the key if it exists, else raise a KeyError.

## Key Components

### MemTable

Writes go directly to the MemTable. When the MemTable gets full, it is flushed to disk via fsync(). The MemTable remains sorted on insertion so that we incur no sorting cost when flushing to disk.

### Write-Ahead Log (WAL)

The WAL is essential for ensuring durability. Every write is immediately appended to the WAL. Only after memTable.flush() is the WAL cleared. If the database crashes, the WAL will be replayed on startup to build the memtable.

### SSTable

The core data structure on disk is the SSTable. An SSTable is just a file that stores key-value pairs in sorted order. It is immutable once written to disk. The purpose of this is to enable fast, append-only writes; outdated entries will eventually be overwritten during the background compaction process. The compaction process 

The disk layout of an SSTable is as such:

```plaintext
// SSTable DISK LAYOUT:

| Entry 0 | Entry 1 | ... | Entry N |
| timestamp |
| file_num |
```

When searching for a particular key, the StorageManager queries each LevelManager from level 0 to the bottom-most level if the key exists. Each LevelManager is just a thin wrapper that stores the in-memory representation of the SSTables in that level. My current implementation naively stores the SSTables in-memory as `std::vector<std::unique_ptr<SSTable»`

. Each SSTable is heap-allocated, and there is exactly one instance of an SSTable in the heap at any point in time. We used a `std::unique_ptr` to enforce ownership semantics, ie. that the SSTable is owned by the LevelManager of the level it belongs to. 

The current in-memory SSTable representation is intentionally naive and built for learning rather than scale. It eagerly loads the full dataset into memory and scans them, which is fine for small, toy datasets but doesn't scale for real-world production usage. We can greatly improve it and ensure things like sequential disk I/O by …

1. Don't load the full SSTable and its entries into memory.
2. Split up each SSTable into blocks. A block is the smallest unit of memory in the system, and it can be cached in a separate buffer pool, and fetched from disk when needed.

**TODO:**

1. Motivation
2. Architecture (LSM-Tree Key Value Store)
3. Components and the role they play
4. Future features (actual memory management / benchmarking and optimization - when is the “right” time to bench and optimize? /  concurrency handling / making it distributed)
5. SSTable disk layout (Part II: Implementation Details)
6. Memory management (Part II: Implementation Details)
7. Iterators (Part II: Implementation Details)
