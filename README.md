<h1 align="center">
  <a href="https://testingjavascript.com/courses/test-node-js-backends">Testing Node.js Backends</a>
</h1>

👋 hi there! My name is [Kent C. Dodds](https://kentcdodds.com)! This is a
workshop repo to teach you how to test your Node.js Apps!

<div align="center">
  <h2><a href="https://testingjavascript.com">TestingJavaScript.com</a></h2>
  <a href="https://testingjavascript.com">
    <img
      width="500"
      alt="Learn the smart, efficient way to test any JavaScript application."
      src="https://kentcdodds.com/images/testingjavascript-promo/tjs-4.jpg"
    />
  </a>
</div>

<hr />

[![Build Status][build-badge]][build]
[![AppVeyor Build Status][win-build-badge]][win-build]
[![Code Coverage][coverage-badge]][coverage]
[![GPL 3.0 License][license-badge]][license]
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs] [![Code of Conduct][coc-badge]][coc]

## Prerequisites

- Have fundamental understanding and experience with automated testing and
  tools. (Additional learning material:
  [But really, what is a JavaScript test?](https://kentcdodds.com/blog/but-really-what-is-a-javascript-test)
  and
  [But really, what is a JavaScript mock?](https://kentcdodds.com/blog/but-really-what-is-a-javascript-mock))
- Have experience with modern JavaScript APIs and features.

## System Requirements

- [git][git] v2 or greater
- [NodeJS][node] v12 or greater
- [yarn][yarn] v1 or greater (or [npm][npm] v6 or greater)

All of these must be available in your `PATH`. To verify things are set up
properly, you can run this:

```shell
git --version
node --version
yarn --version # or npm --version
```

If you have trouble with any of these, learn more about the PATH environment
variable and how to fix it here for [windows][win-path] or
[mac/linux][mac-path].

## Setup

> If you want to commit and push your work as you go, you'll want to
> [fork](https://docs.github.com/en/free-pro-team@latest/github/getting-started-with-github/fork-a-repo)
> first and then clone your fork rather than this repo directly.

After you've made sure to have the correct things (and versions) installed, you
should be able to just run a few commands to get set up:

```
git clone https://github.com/kentcdodds/testing-node-apps.git
cd testing-node-apps
node setup
```

This may take a few minutes. **It will ask you for your email.** This is
optional and just automatically adds your email to the links in the project to
make filling out some forms easier.

If you get any errors, please read through them and see if you can find out what
the problem is. If you can't work it out on your own then please [file an
issue][issue] and provide _all_ the output from the commands you ran (even if
it's a lot).

If you can't get the setup script to work, then just make sure you have the
right versions of the requirements listed above, and run the following commands:

```
npm install
npm run validate
```

It's recommended you run everything locally in the same environment you work in
every day, but if you're having issues getting things set up, you can also set
this up using [GitHub Codespaces](https://github.com/features/codespaces)
([video demo](https://www.youtube.com/watch?v=gCoVJm3hGk4)) or
[Codesandbox](https://codesandbox.io/s/github/kentcdodds/testing-node-apps).

## App Intro

### App Demo

This is the backend for [Bookshelf](https://bookshelf.lol). I recommend you play
around with it a little bit to get an idea of the kind of data we're dealing
with here.

### Data Model

- User

  - id: string
  - username: string

- List Item

  - id: string
  - bookId: string
  - ownerId: string
  - rating: number (-1 is no rating, otherwise it's 1-5)
  - notes: string
  - startDate: number (`Date.now()`)
  - finishDate: number (`Date.now()`)

> For convenience, our we return a `book` object on each list item which is the
> book it's associated to. You're welcome frontend folks!

> /me wishes we could use GraphQL

- Book

  - id: string
  - title: string
  - author: string
  - coverImageUrl: string
  - pageCount: number
  - publisher: string
  - synopsis: string

## Running the tests

```shell
npm test
```

This will start [Jest](https://jestjs.io/) in watch mode. Read the output and
play around with it. You'll be working in the `.exercise` files.

### Exercises

- `src/**/__tests__/[title].md`: Background, Exercise Instructions, Extra Credit
- `src/**/__tests__/[title].exercise.js`: Exercise with Emoji helpers
- `src/**/__tests__/[title].final.js`: Final version
- `src/**/__tests__/[title].final.extra-#.js`: Final version of extra credit
- `src/**/[title].js`: The source file that you'll be testing

The purpose of the exercise is **not** for you to work through all the material.
It's intended to get your brain thinking about the right questions to ask me as
_I_ walk through the material.

Here's the order of exercises we'll be doing as well as where you can find the
markdown file associated with each.

1.  🏋 Testing Pure Functions: `src/utils/__tests__/auth.md`
2.  🏋 Testing Middleware: `src/utils/__tests__/error-middleware.md`
3.  🏋 Testing Controllers: `src/routes/__tests__/list-items-controller.md`
4.  🏋 Testing Authentication API Routes: `src/__tests__/auth.md`
5.  🏋 Testing CRUD API Routes: `src/__tests__/list-items.md`

### Helpful Emoji 🐨 💪 🏁 💰 💯 🦉 📜 💣 👨‍💼 🚨

Each exercise has comments in it to help you get through the exercise. These fun
emoji characters are here to help you.

- **Kody the Koala** 🐨 will tell you when there's something specific you should
  do
- **Matthew the Muscle** 💪 will indicate what you're working with an exercise
- **Chuck the Checkered Flag** 🏁 will indicate that you're working with a final
  version
- **Marty the Money Bag** 💰 will give you specific tips (and sometimes code)
  along the way
- **Hannah the Hundred** 💯 will give you extra challenges you can do if you
  finish the exercises early.
- **Olivia the Owl** 🦉 will give you useful tidbits/best practice notes and a
  link for elaboration and feedback.
- **Dominic the Document** 📜 will give you links to useful documentation
- **Berry the Bomb** 💣 will be hanging around anywhere you need to blow stuff
  up (delete code)
- **Peter the Product Manager** 👨‍💼 helps us know what our users want
- **Alfred the Alert** 🚨 will occasionally show up in the test failures with
  potential explanations for why the tests are failing.

## Troubleshooting

<details>

<summary>"node setup" not working</summary>

If you're confident that your system meets the system requirements above, then
you can skip the system validation and manually setup the project:

```
npm install
npm run validate
```

If those scripts fail, please try to work out what went wrong by the error
message you get. If you still can't work it out, feel free to [open an
issue][issue] with _all_ the output from that script. I will try to help if I
can.

</details>

## Contributors

Thanks goes to these wonderful people
([emoji key](https://github.com/all-contributors/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://kentcdodds.com"><img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;" alt=""/><br /><sub><b>Kent C. Dodds</b></sub></a><br /><a href="https://github.com/kentcdodds/testing-node-apps/commits?author=kentcdodds" title="Code">💻</a> <a href="https://github.com/kentcdodds/testing-node-apps/commits?author=kentcdodds" title="Documentation">📖</a> <a href="#infra-kentcdodds" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/kentcdodds/testing-node-apps/commits?author=kentcdodds" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://stackshare.io/jdorfman/decisions"><img src="https://avatars1.githubusercontent.com/u/398230?v=4" width="100px;" alt=""/><br /><sub><b>Justin Dorfman</b></sub></a><br /><a href="#fundingFinding-jdorfman" title="Funding Finding">🔍</a></td>
    <td align="center"><a href="https://www.andrewm.codes"><img src="https://avatars1.githubusercontent.com/u/18423853?v=4" width="100px;" alt=""/><br /><sub><b>Andrew Mason</b></sub></a><br /><a href="https://github.com/kentcdodds/testing-node-apps/commits?author=andrewmcodes" title="Documentation">📖</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the
[all-contributors](https://github.com/all-contributors/all-contributors)
specification. Contributions of any kind welcome!

## License

This material is available for private, non-commercial use under the
[GPL version 3](http://www.gnu.org/licenses/gpl-3.0-standalone.html). If you
would like to use this material to conduct your own workshop, please contact me
at me@kentcdodds.com

## Workshop Feedback

Each exercise has an Elaboration and Feedback link. Please fill that out after
the exercise and instruction.

At the end of the workshop, please go to this URL to give overall feedback.
Thank you! https://kcd.im/tna-ws-feedback

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[git]: https://git-scm.com/
[yarn]: https://yarnpkg.com/
[build-badge]:
  https://img.shields.io/travis/kentcdodds/testing-node-apps.svg?style=flat-square&logo=travis
[build]: https://travis-ci.org/kentcdodds/testing-node-apps
[license-badge]:
  https://img.shields.io/badge/license-GPL%203.0%20License-blue.svg?style=flat-square
[license]:
  https://github.com/kentcdodds/testing-node-apps/blob/master/README.md#license
[prs-badge]:
  https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[coc-badge]:
  https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]:
  https://github.com/kentcdodds/testing-node-apps/blob/master/CODE_OF_CONDUCT.md
[github-watch-badge]:
  https://img.shields.io/github/watchers/kentcdodds/testing-node-apps.svg?style=social
[github-watch]: https://github.com/kentcdodds/testing-node-apps/watchers
[github-star-badge]:
  https://img.shields.io/github/stars/kentcdodds/testing-node-apps.svg?style=social
[github-star]: https://github.com/kentcdodds/testing-node-apps/stargazers
[twitter]:
  https://twitter.com/intent/tweet?text=Check%20out%20testing-node-apps%20by%20@kentcdodds%20https://github.com/kentcdodds/testing-node-apps%20%F0%9F%91%8D
[twitter-badge]:
  https://img.shields.io/twitter/url/https/github.com/kentcdodds/testing-node-apps.svg?style=social
[emojis]: https://github.com/all-contributors/all-contributors#emoji-key
[all-contributors]: https://github.com/all-contributors/all-contributors
[win-path]:
  https://www.howtogeek.com/118594/how-to-edit-your-system-path-for-easy-command-line-access/
[mac-path]: http://stackoverflow.com/a/24322978/971592
[issue]: https://github.com/kentcdodds/testing-node-apps/issues/new
[win-build-badge]:
  https://img.shields.io/appveyor/ci/kentcdodds/testing-node-apps.svg?style=flat-square&logo=appveyor
[win-build]: https://ci.appveyor.com/project/kentcdodds/testing-node-apps
[coverage-badge]:
  https://img.shields.io/codecov/c/github/kentcdodds/testing-node-apps.svg?style=flat-square
[coverage]: https://codecov.io/github/kentcdodds/testing-node-apps
[watchman]: https://facebook.github.io/watchman/docs/install.html
