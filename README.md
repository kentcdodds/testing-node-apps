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

## Pre-Workshop Instructions/Requirements

In order for us to maximize our efforts during the workshop, please do the
following:

- [ ] Setup the project (follow the setup instructions below) (~5 minutes)
- [ ] Install and setup [Zoom](https://zoom.us) on the computer you will be
      using (~5 minutes)
- [ ] Watch
      [Use Zoom for KCD Workshops](https://egghead.io/lessons/egghead-use-zoom-for-kcd-workshops)
      (~8 minutes).
- [ ] Watch
      [Setup and Logistics for KCD Workshops](https://egghead.io/lessons/egghead-setup-and-logistics-for-kcd-workshops)
      (~24 minutes). Please do NOT skip this step.
- [ ] Attend my
      [Testing Fundamentals Workshop](https://kentcdodds.com/workshops/testing-fundamentals)
      **or** have the equivalent fundamental understanding and experience with
      automated testing and tools. (Additional learning material:
      [But really, what is a JavaScript test?](https://kentcdodds.com/blog/but-really-what-is-a-javascript-test)
      and
      [But really, what is a JavaScript mock?](https://kentcdodds.com/blog/but-really-what-is-a-javascript-mock))
- [ ] Attend my
      [Modern JavaScript Workshop](https://kentcdodds.com/workshops/modern-javascript)
      **or** have the equivalent experience with modern JavaScript APIs.
- [ ] Attend my
      [Asynchronous JavaScript Workshop](https://kentcdodds.com/workshops/asynchronous-javascript)
      **or** have equivalent experience with asynchronous JavaScript.

The more prepared you are for the workshop, the better it will go for you.

## Workshop Outline

Here are the topics we'll be covering:

- Testing Pure Functions
- Testing Middleware
- Testing Controllers
- Testing API routes
- Mocking third party dependencies
- Testing authenticated code

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

You should be able to work through the entire workshop in the browser. This is
actually the recommended approach as it requires absolutely no setup whatsoever.
Go to
[this codesandbox](https://codesandbox.io/s/github/kentcdodds/testing-node-apps)
and click `Fork` in the top right corner. Then click the `+` in the terminal and
you can run `npm test` to get the test watch mode started.

[![Edit testing-node-apps](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/kentcdodds/testing-node-apps)

If you'd rather be able to work through the workshop on your own computer, then
follow the following instructions.

After you've made sure to have the correct things (and versions) installed, you
should be able to just run a few commands to get set up:

```
git clone https://github.com/kentcdodds/testing-node-apps.git
cd testing-node-apps
node setup
```

This may take a few minutes. **It will ask you for your email.** This is
optional and just automatically adds your email to the links in the project to
make filling out some forms easier If you get any errors, please read through
them and see if you can find out what the problem is. You may also want to look
at [Troubleshooting](#troubleshooting). If you can't work it out on your own
then please [file an issue][issue] and provide _all_ the output from the
commands you ran (even if it's a lot).

## Running the tests

```shell
npm test
```

This will start [Jest](http://facebook.github.io/jest) in watch mode. Read the
output and play around with it.

**Your goal will be to go into each test, swap the final version for the
exercise version in the import, and make the tests pass**

## Helpful Emoji 🐨 💰 💯 🦉 📜 💣 🚨

Each exercise has comments in it to help you get through the exercise. These fun
emoji characters are here to help you.

- **Kody the Koala Bear** 🐨 will tell you when there's something specific you
  should do
- **Marty the Money Bag** 💰 will give you specific tips (and sometimes code)
  along the way
- **Hannah the Hundred** 💯 will give you extra challenges you can do if you
  finish the exercises early.
- **Olivia the Owl** 🦉 will give you useful tidbits/best practice notes and a
  link for elaboration and feedback.
- **Dominic the Document** 📜 will give you links to useful documentation
- **Berry the Bomb** 💣 will be hanging around anywhere you need to blow stuff
  up (delete code)
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
