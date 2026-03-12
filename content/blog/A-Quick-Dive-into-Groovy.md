---
title: A Quick Dive into Groovy
---

At my current internship, I got assigned to some DevOps tasks. A large part of the process involves writing Jenkinsfiles to automate the CI pipeline. I find it really boring, so I decided to dive into how Jenkinsfiles actually work. How is a Jenkinsfile, written in Groovy (a language that can be run on the JVM and is fully interoperable with Java), “understood” and parsed by the Jenkins Controller? How does Groovy syntax work? I document what I learned here.

## Jenkinsfile Declarative Pipeline Syntax

In a typical Jenkinsfile, we see code like this:

```groovy
stage('Build') { 
    echo 'Hi' 
}

```

This is the Groovy equivalent to the function call:

```java
stage('Build', { echo('hi') }) // function signature: `stage(String name, Closure closure) 
```

### The stage method

This method is implemented in Jenkins' DSL library. Under the hood, it does something like this:

```groovy
// Inside the Jenkins Source Code
def stage(String name, Closure body) {
    // 1. Tell the UI we started a stage
    println "Starting stage: ${name}"
    
    // 2. The "Magic": Re-route method calls
    // We tell the block of code: "If you call a method you don't recognize, 
    // look inside this 'StepExecutor' object."
    body.resolveStrategy = Closure.DELEGATE_FIRST // (a)
    body.delegate = new StepExecutor() // (b) 
    
    // 3. Run the user's code
    body.call() // (c)
}
```

Jenkins makes use of Groovy's inbuilt Closure class for the runnable script. If we take a closer look at the code at line (a), we set the resolveStrategy field to Closer.DELEGATE\_FIRST. To understand what's happening, we need to first understand how a Closure handles method lookups.

### Groovy `Closure` method lookup

Within a `Closure`, if the code contains a function call (eg. `echo("hi")`), Groovy needs to know where it can find this method. Groovy has 3 places where it does this:

1. owner: The script/class where the block was actually written.
2. delegate: A "helper" object you assigned to the block, via closure.delegate = new MyClassWithTheMethod
3. methodMissing hook: A fallback if the first two fail. (I have yet to explore what this is and how it works.)

In the previous code example, we see `body.resolveStrategy = Closure.DELEGATE_FIRST`. `resolveStrategy` essentially tells Groovy: "If I call a method, who do I ask first? My Owner or my Delegate?" So Groovy looks in these places to resolve the call to `echo`, and for every other function call that happens in the code passed to the closure argument when we called `stage()`.

## Summary

1. Jenkinsfiles are written in Groovy.
2. Jenkinsfile declarative syntax looks like blocks of code but are really just function calls.
3. Jenkins utilizes Groovy's Closure class to wrap user-provided code. It sets the Closure‘s delegate field to a Jenkins DSL object. When the closure is run (\`Closure.call()\` - see line © in the given code), functions in the body are resolved by looking at the Closure instance's delegate. If not found, it then uses the methodMissing hook as fallback for method resolution. Because Jenkins sets the delegate object for the Closrue of a particular method (eg. stage(), pipeline()), it can enforce that the user-provided scripts that are passed into these methods can only use certain Jenkins-provided function calls. For example, the closure for stage can only call methods like sh().

.
