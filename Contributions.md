# Contributing

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

This project adheres to the Contributor Covenant [code of conduct](https://github.com/LeGitHubDeTai/AnimeBack/blob/master/CODE_OF_CONDUCT.md).
By participating, you are expected to uphold this code. Please report unacceptable
behavior to tai.studio@outlook.fr.

The following is a set of guidelines for contributing to `electron-apps`.
These are just guidelines, not rules. Use your best judgment and feel free to
propose changes to this document in a pull request.

## Adding your extensions

If you have an Electron application you'd like to see added, please
[open a pull request](https://help.github.com/articles/creating-a-pull-request/)!
All that's required is a basic YML file and a PNG icon.


## How it Works

This package is a joint effort between humans and robots.

First, a human adds an app:

```
extensions
└── niceExt
    ├── niceExt-icon.png
    └── build
    └── niceExt.json
```

The json file requires just a few fields:

```json
{
	"name": "niceExt",
	"desc": "Add Nice on Your Wallpaper",
	"author": "Tai Studio",
  "category": "Developer Tools",
  "website": "https://tai-studio.ml/",
  "repository": "https://github.com/LeGitHubDeTai",
	"file": "niceExt.asar",
	"version": "1.0.0"
}
```

Humans can include other data like `keywords` and `license`, but they're not required to do so.

The human then opens a PR. Tests pass, the PR gets merged. Yay!

Later, a bot comes along and adds more data about the app.

First, the date the app was submitted is inferred from the git history. Humans could provide this metadata, but they shouldn't have to. Let the machines do the work.

```json
{
  "date": "2021-04-24"
}
```
