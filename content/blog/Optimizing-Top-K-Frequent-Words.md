---
title: Optimizing Top K Frequent Words
createdAt: 2026-03-23T08:27:49.048Z
updatedAt: 2026-03-23T08:27:53.473Z
---

Today I decided to try optimizing a fairly simple function to see how far we can go. The function in question is Top K Frequent Words.

Here is the initial implementation:

```cpp
vector<string> topKFrequent(vector<string> &words, int k)
{
    // Step 1: Count frequencies using unordered_map
    // Time = O(nl) due to hashing each `word`
    unordered_map<string, int> freq;
    for (const string &word : words)
    {
        freq[word]++;
    }

    // Step 2: Create a vector of pairs (frequency, word)
    // All unique words are copied.
    // Time = O(nl), n == len(words), l == length of longest word

    // COPY - worst case `n` words are copied
    vector<pair<int, string>> freqWord;
    for (const auto &p : freq)
    {
        freqWord.emplace_back(p.second, p.first);
    }

    // Step 3: Sort the vector
    // Sort by frequency descending, then by word ascending for ties
    // Time = O(nlogn * l)
    sort(freqWord.begin(), freqWord.end(), [](const pair<int, string> &a, const pair<int, string> &b)
         {
        if (a.first != b.first) return a.first > b.first;
        return a.second < b.second; });

    // Step 4: Extract top K words
    // COPY - worst case `k` words are copied
    vector<string> result;
    for (int i = 0; i < k && i < static_cast<int>(freqWord.size()); ++i)
    {
        result.push_back(freqWord[i].second);
    }

    return result;
}
```

## Optimization [#1](#1) 

This is the most obvious one. Instead of copying all (string, freq) into a vector, then sorting that vector, which takes O(nlogn \* L) time (where n is the number of words and L the length of the longest word), we can insert all (freq, string) into a min heap of size K. When the heap size exceeds K, pop the element with smallest frequency from it. Lastly, pop from the heap while its not empty, and copy each string into the result vector.

We can also reserve() the size of the result vector to K, to prevent resizing especially for large values of K.

Here is the code:

```cpp
vector<string> topKFrequent(vector<string> &words, int k)
{
    // Step 1: Count frequencies using unordered_map
    // Time = O(nl) due to hashing each `word`
    // COPY
    unordered_map<string, int> freq;
    for (const string &word : words)
    {
        freq[word]++;
    }

    vector<string> result; // later can reserve to len(words)
    result.reserve(k);

    // time = O(logk + l) per push, as each push copies the string inside
    // COPY
    priority_queue<pair<int, string>, vector<pair<int, string>>, greater<>> minheap;
    for (const auto &p : freq)
    {
        minheap.push(pair<int, string>(p.second, p.first));
        if (minheap.size() > k)
            minheap.pop();
    }

    while (!minheap.empty())
    {
        result.emplace_back(minheap.top().second); // call std::string(string&), ie. the copy ctor
        minheap.pop();
    }

    return result;
}
```

This got us from 2615955 us to 883767 us. The improvement is marginal as we used a small value of K (K = 3), while N = 1,000,000.

## Optimization [#2](#2) - compile with -O2

This got us from 883767 us to 399465 us, which is pretty cool.

## Optimization [#3](#3) - reserve size of freq

Reserve size of freq to words.size(). This prevents rehashing when the number of buckets is insufficient, especially if we have a large number of unique words. 

This got us from 399465 us to 206959 us! The speedup is marginal as our test case contains 1,000,000 unique words, so we probably saved time from rehashing.
