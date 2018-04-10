# css-server
*On the fly css module builder*

### What is css-server?

css-server is inspired by [css-modules](https://github.com/css-modules/css-modules). It converts "global" css to "local" and provides an object so you can access your classes in javascript code.

### How it works?

It intercepts all HTTP GET requests for *.css files and returns a custom javascript which exports an object containing all the class names.
Before exporting the object, it appends the converted css to the head wrapped in a style tag.

### How about source maps?

Currently, we generate very primitive source maps. We plan to have full source-map support.

### How to contribute?

- You can open an issue.
- You can create a pull request.
