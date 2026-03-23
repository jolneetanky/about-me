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

Below is how I tested the function. I created a vector with 1 million words, and the size of each word is relatively small. To keep things simple, I took the average of 5 runs to benchmark each implementation. If I wanted it to be more accurate, I'd use a larger sample size, say 50 or 100. The timings used below are the average of 5 runs for test case 3. 

```cpp
int main(int argc, char *argv[])
{
    constexpr int numTrials = 5;

    string outputFileName = argv[1];
    vector<pair<vector<string>, int>> args;
    ofstream outputFile(outputFileName);

    if (!outputFile.is_open())
    {
        cerr << "Failed to open output.txt" << endl;
        return 1;
    }

    // Test case 1
    vector<string> words1 = {"i", "love", "leetcode", "i", "love", "coding"};
    int k1 = 2;
    args.emplace_back(move(words1), move(k1));

    vector<string> words2 = {"the", "day", "is", "sunny", "the", "the", "the", "sunny", "is", "is"};
    int k2 = 4;
    args.emplace_back(move(words2), move(k2));

    vector<string> words3;
    int k3 = 3;
    for (int i = 0; i < 1000000; i++)
    {
        words3.push_back("word" + to_string(i));
    }
    args.emplace_back(move(words3), move(k3));

    for (auto &[words, k] : args)
    {
        vector<string> result;
        long long totalDurationUs = 0;

        for (int trial = 0; trial < numTrials; ++trial)
        {
            auto start = chrono::high_resolution_clock::now();
            vector<string> currentResult = topKFrequent(words, k);
            auto end = chrono::high_resolution_clock::now();
            auto duration = chrono::duration_cast<chrono::microseconds>(end - start);

            totalDurationUs += duration.count();

            if (trial == 0)
            {
                result = std::move(currentResult);
            }
        }

        double averageDurationUs = static_cast<double>(totalDurationUs) / numTrials;

        outputFile << "Top " << k << " frequent words: ";
        for (const string &word : result)
        {
            outputFile << word << " ";
        }
        outputFile << " (Average Time over " << numTrials << " runs: " << averageDurationUs << " us)" << endl;
    }

    return 0;
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
  

    // time = O(logk + l) per push, as each push copies the string inside
    // COPY
    priority_queue<pair<int, string>, vector<pair<int, string>>, greater<>> minheap;
    for (const auto &p : freq)
    {
        minheap.push(pair<int, string>(p.second, p.first));
        if (minheap.size() > k)
            minheap.pop();
    }

    // Build result
    vector<string> result; // later can reserve to len(words)
    result.reserve(k);

    while (!minheap.empty())
    {
        result.emplace_back(minheap.top().second); // call std::string(string&), ie. the copy ctor
        minheap.pop();
    }
        
    reverse(result.begin(), result.end());
    return result;
}
```

This got us from 1.49033e+06 us to 961690 us. The improvement is marginal as we used a small value of K (K = 3), while N = 1,000,000.

## Optimization [#2](#2) - compile with -O2

This got us from 961690 us to 284413 us , which is pretty cool.

## Optimization [#3](#3) - reserve size of freq

Reserve size of freq to words.size(). This prevents rehashing when the number of buckets is insufficient, especially if we have a large number of unique words.

This got us from 284413 usto 126369 us! The speedup is marginal as our test case contains 1,000,000 unique words, so we probably saved a lot time from rehashing.

## Optimization [#4](#4) - use iterators in minheap instead of string

```cpp
vector<string> topKFrequent(vector<string> &words, int k)
{
    // Step 1: Count frequencies using unordered_map
    // Time = O(nl) due to hashing ach `word`
    // COPY
    unordered_map<string, int> freq;
    freq.reserve(words.size());

    for (const string &word : words)
    {
        freq[word]++;
    }

    // // Build minheap
    using FreqIt = unordered_map<string, int>::const_iterator; // iterate along the freqMap itself

    auto cmp = [](FreqIt a, FreqIt b)
    {
        // return `true` if `a` is below `b` in the heap
        // since this is a minheap,
        // WLOG, a will be below b in the heap if aFreq > than bFreq
        if (a->second != b->second)
            return a->second > b->second; // if a is greater than b, `true` as a will be below b in the heap.
        return a->first < b->first;       // `a` has larger lexical ordering, and since this is a minheap it will be below `b`.
    };

    priority_queue<FreqIt, vector<FreqIt>, decltype(cmp)> minheap(cmp);

    for (FreqIt it = freq.begin(); it != freq.end(); it++)
    {
        minheap.push(it);
        if (minheap.size() > k)
        {
            minheap.pop();
        }
    }

    vector<string> result;
    result.reserve(k);

    while (!minheap.empty())
    {
        result.emplace_back(minheap.top()->first); // call std::string(string&), ie. the copy ctor
        minheap.pop();
        // TODO: move as the stringsi n minheap are not needed anymore
    }

    reverse(result.begin(), result.end());

    return result;
}
```

This had little to no improvement, which I didn't expect. Average timing was 108310 us.

## Optimization [#5:](#5:) Use string\_view in freqMap instead of string

Instead of copying the strings into freqMap, use string\_view to avoid copying. The tradeoff is that means words needs to outlive the function.

Strange thing is there are no improvements as well. Average timing is now 130242 us.

```cpp
    unordered_map<string_view, int> freq;
    freq.reserve(words.size());

    for (const string &word : words)
    {
        freq[word]++;
    }
```

## Conclusion

By far the largest wins to latency were:

1. Compiler optimizations - compiling with O2 effectively led to a \~4x speedup. One thing -O2 does is inline hot functions (Eg. unordered\_map accessors, priority\_queue.push(), etc.). This likely reduced significant call overhead when we had a million words, which otherwise would call these functions a million times. 
2. Algorithmic and data structure changes - by using a minheap of size K instead of a sorting vector of size N, we effectively reduced the time complexity of the function from O(nlogn) to O(nlogk). This is especially effective if K is small relative to N.
3. Reserving containers where possible - by reserving the size of freq before inserting into it, we cut down latency by half, suggesting that resizing was a huge bottleneck in the case of a large number of unique values.

Optimizations 4 and 5 to reduce string copying didn't have any latency speedups. This is likely because string sizes were small, so string copying wasn't the bottleneck. Its effects are likely more obvious if we had large word sizes, where string copying causes significant overhead.
