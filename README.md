github-webhook
==============

A GitHub webhook that will merge the branch with the CI-built installers back into the main branch on flickr-downloadr.github.io


Run this command to debug this locally:

```shell script
DEBUG="fd:*" PORT=1337 NODE_ENV="production" MONGODB_URI="mongodb+srv://username:password@fd-webhook.abcde.mongodb.net/fd-webhook?retryWrites=true&w=majority" node app.js
```
