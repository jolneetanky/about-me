---
title: 'Writing TinyKV: A Key Value Store in C++'
createdAt: 2026-02-09T17:11:44.647Z
updatedAt: 2026-03-11T17:11:51.069Z
---

## Motivation

I wrote this key-value store as an introductory project to C++. I was inspired by a friend and decided to implement it myself. You can check out his blog post [here](https://mraihan.dev/blog/LSM-tree-Key-Value-Store-in-CPP).

## High-level design

![](</images/Screenshot 2026-03-15 at 9.47.54 PM.png>)

## API

The key-value store has a simple API:

1. Put(key, val): If key already exists, then its value is overwritten with val. Otherwise, the new (key, val) pair is added to the system.
2. Get(key): Returns (key, val) if it exists and hasn't been deleted. Otherwise, raise a KeyError.
3. Del(key): Deletes the key if it exists, else raise a KeyError.

## Key components

### 1) MemTable

Writes go directly to the MemTable. When the MemTable gets full, it is flushed to disk via fsync(). The MemTable remains sorted on insertion so that we incur no sorting cost when flushing to disk.

### 2) Write-Ahead Log (WAL)

The WAL is essential for ensuring durability. Every write is immediately appended to the WAL. Only after memTable.flush() is the WAL cleared. If the database crashes, the WAL will be replayed on startup to build the memtable.

### 3) SSTable

The core data structure on disk is the SSTable. An SSTable is just a file that stores key-value pairs in sorted order. It is immutable once written to disk. The purpose of this is to enable fast, append-only writes; outdated entries will eventually be overwritten during the background compaction process. The compaction process

The disk layout of an SSTable is as such:

```plaintext
// SSTable DISK LAYOUT:

| Entry 0 | Entry 1 | ... | Entry N |
| timestamp |
| file_num |
```

#### SSTableIterator

This iterator is used by higher-level components (eg. LevelManager) to traverse the entries in an SSTable, without needing to know details such as which parts of the SSTable live on disk/in-memory, what caching strategies are used, how each Entry is laid out on disk/in-memory.

A core assumption / invariant is that SSTables are never empty. It will always have $>=$ 1 entry.

The API is the same as that of LevelDB's iterators:

1. Valid() - true if the iterator currently points to an entry in the SSTable, false otherwise.
2. SeekToFirst() - Rewind the iterator to the very first Entry in the SSTable.
3. SeekToLast() - Move the iterator to the very last Entry in the SSTable.
4. Seek(key) - Move to the first position with matching target key. If the key doesn't exist in the SSTable, the iterator is now not Valid(). Currently implemented with binary search on all entries in an SSTable.
5. Next() - Move the iterator one position forward. If we were previously at the last entry, the iterator is now not Valid().
6. Key() - Requires Valid(). Returns the key for the current entry pointed to.
7. Value() - Requires Valid(). Returns the value for the current entry pointed to.
8. IsTombstone() - Requires Valid(). Returns true if the current entry pointed to is tombstoned (ie. has been deleted).

#### Searching for a key

When searching for a particular key, the StorageManager queries each LevelManager from level 0 to the bottom-most level if the key exists. Each LevelManager is just a thin wrapper that stores the in-memory representation of the SSTables in that level. For each SSTable within the level, we create an `SSTableIterator`, and use `SSTableIterator.seek(key)` to search for the key in the SSTable. If the key exists, we return it, otherwise we move on to the next SSTable within the level. If the key isn't found in level L, the StorageManager continues its search in the next level, L+1.

Each LevelManager stores an in-memory representation of all SSTables in that level, inside an `std::vector<std::unique_ptr<SSTable»`. Each SSTable is heap-allocated, and there is exactly one instance of an SSTable in the heap at any point in time. I used `std::unique_ptr<SSTable>` to enforce ownership semantics, ie. that the SSTable is owned by the LevelManager of the level it belongs to.

#### In-memory representation

The current in-memory SSTable representation is intentionally naive and built for learning rather than scale. It eagerly loads the full dataset into memory and scans them, which is fine for small, toy datasets but doesn't scale for real-world production usage. There are a few things we can do so that TinyKV can handle large amounts of data:

1. Don't load the full SSTable and its entries into memory. Instead, create an index for each SSTable. The index maps each key to its byte offset within the file. We can store the index on disk, and only fetch it when needed. Now, each Get(key) operation involves
2. Split up each SSTable into blocks. A block is the smallest unit of memory in the system, and it can be cached in a separate buffer pool, and fetched from disk when needed. This is similar to how PostgreSQL manages memory.
3. Block + block index - Instead of one index entry for every key, map one index entry for every SSTable **block**.
   1. Each SSTable has a block index, mapping `blockStartKey → blockOffset`. When searching for a particular key, first load the blockIndex into memory, and perform a binary search to identify the block that potentially stores the key.
   2. Each block is guaranteed to be able to fit in memory. Once we have identified our target block, seek to the block's starting byte offset. After a block is read into memory, perform binary search on the entries to find the key.

## Future improvements

1. Implement per-SSTable index.
2. Implement block-based SSTables + block caching (With eg. clock replacement strategy)
3. Benchmark its performance against LevelDB for different workloads.

## References

1. [https://github.com/google/leveldb](https://github.com/google/leveldb)
2. [https://medium.com/@satviknema/implementing-lsm-based-key-value-store-in-java-from-scratch-46c1b23d6924](https://medium.com/@satviknema/implementing-lsm-based-key-value-store-in-java-from-scratch-46c1b23d6924)
