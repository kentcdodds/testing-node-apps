# Testing Authentication API Routes

## Background

It's a great idea to have some tests that do as minimal mocking/faking as
possible. Tests which actually interact with the full server via HTTP and
communicate with a backend and any other services your app relies on.

Every app is a bit different, but the optimal situation is to have the backend
and other services running locally in a docker container. If that's not
possible, then you need to decide between mocking that service/database or
running against a "test environment." The problem with the test environment is
that they're typically pretty flaky and there's network latency which will slow
down your tests, so a docker container is best.

To simplify the setup for this workshop, our database is actually running in
memory, but for all intents and purposes the tests that you'll be writing here
would look just like tests you would be writing whether the database is running
in docker or even in a test environment. You'll just need to make sure that the
container/environment is running before you start running your tests, that's
really the only difference.

However you end up doing this, having the full server running and interacting
with it the way your client-side application will be (via HTTP) is a crucial
piece to getting the confidence you need out of your app. In fact, I argue that
most of your codebase coverage should come from these kinds of tests.

> 📜 Read more about this on my blog:
> [Write tests. Not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests)

The biggest challenge you face with tests like this are:

1. They take more setup
2. They have more points of failure

That said, they give you a huge amount of confidence for the effort and give you
fewer false negatives and false positives, which is why I recommend focusing on
them. (For more on this, read
[Testing Implementation Details](https://kentcdodds.com/blog/testing-implementation-details)).

The setup required includes getting the server started. The way I've structured
it for this project is the way I recommend structuring it for all Node apps as
it's a great way to run tests in isolation from one another but still in
parallel. As mentioned, you'll also need to make sure that your database and any
other services your app depends on are running or properly mocked.

Another piece to the setup often includes making certain that the database is in
a clean state. Sometimes you can get away with a database that has a lot of old
test data in it, but it's better if you can have the database cleared out for
every test. **Tests like these are often more comprehensive** in part for this
reason as well as the fact that it makes writing the tests a little easier and
more useful.

## Exercise

In the exercises, you'll have a single test that runs through the whole
authentication flow: register -> login -> GET /api/auth/me

To get to this test though, there's quite a bit of setup you have to do:

### beforeAll/afterAll/beforeEach

One of [the globals](https://jestjs.io/docs/en/api) exposed by Jest is a
`beforeAll` hook. This allows you to run some code before any of the tests in
the file run.

> Note, there's also a configuration option called
> [`globalSetup`](https://jestjs.io/docs/en/configuration#globalsetup-string)
> which you may find useful for starting up your docker container/database
> before _any_ of your test suites in your whole project run).

The `beforeAll` hook is useful here for starting up the server and creating an
`axios` client that's been configured to interact directly with that server.

When we startup the server, it returns a promise which resolves to the `server`
object. This has a `close` function on it to close down the server. So we'll
reference that in an `afterAll` hook so that when our tests are done we close
the server so it stops waiting on incoming requests.

Here's a quick example:

```javascript
beforeAll(async () => {
  const server = await startServer()
  afterAll(async () => {
    await server.close()
  })
})
```

We'll also be using
[`beforeEach`](https://jestjs.io/docs/en/api#beforeeachfn-timeout) to reset the
database between each test. It functions similar to `beforeAll` except it's run
before every test in the file.

### axios: https://github.com/axios/axios

There are a lot of abstractions for testing with HTTP. I've personally found
them all to be too much of an abstraction and instead prefer something a little
more lightweight. So in our tests we'll be using `axios` to make HTTP requests.

> 🦉 We will be using axios's `interceptors` feature to simplify some things for
> our tests.

In your test, you'll be making multiple requests and waiting for multiple
responses.

Here's an example of the API:

```javascript
const result = await axios.post('http://example.com/api/endpoint', data)
```

You'll be using both of these APIs in this exercise.

## Extra Credit

### 💯 Create a pre-configured axios client

Having the full URL for each of those axios calls is kinda annoying. Luckily,
axios allows you to create a pre-configured client:

```javascript
const api = axios.create({baseURL: 'http://example.com/api'})
const result = await api.post('endpoint', data)
```

Make that work so you don't have to repeat the URL all over the place.

To take it step further, you can also use the `interceptors` API to modify every
response as it comes in. This allows us to make more helpful error messages, and
automatically resolve to the `data` property of the response.

```js
// ...
import {getData, handleRequestFailure} from 'utils/async'

// ...

api.interceptors.response.use(getData, handleRequestFailure)

// ...
```

Give that a try!

### 💯 Ensure a unique server port

We need to make sure that every test has a unique port for the server, otherwise
we can't run our tests in parallel without servers trying to bind to the same
port.

To solve this, we can dynamically determine the port based on
`process.env.JEST_WORKER_ID` which is a number that indicates the worker
"thread" for our current process.

Our `startServer` implementation will default to `process.env.PORT` if it's
available. Well guess what! It is! Checkout `test/setup-env.js` and you'll
notice that we're setting the PORT variable based on the JEST_WORKER_ID. So you
can use that!

The trick will be getting and using the port that the server is listening on so
you make the request to the right place. Here's how you do that:

```javascript
server.address().port
```

So now try to make things work without providing a port to the `server` and
letting the default port be used.

### 💯 Interact directly with the database

Sometimes you'll find it easier to side-step the server's API and interact
directly with the database or other services as part of the setup for your test.
This can have performance benefits as well as reduced code duplication. You are
trading off confidence that things can _get_ into that state however, so I'd
recommend ensuring you have some test that gives you confidence the
services/database can get into that state before side-stepping them like we'll
do in this extra credit.

For this extra credit, the username must be unique and we want to ensure that
our API enforces that. Start your test off by using `usersDB.insert` (from
`../db/users`) to insert a user into the database with a specific username, then
try to hit the API to register a new user with that same username and verify
that the promise is rejected with the correct error message and status code.

### 💯 Test all the edge cases

If you've made it this far, go ahead and test all the edge cases you can think
of to make sure that errors are handled properly (like no password/username, an
invalid password, etc.).

> 🦉 This is where things get a little squishy. You might argue that it'd be
> better to test these kinds of edge cases closer to the authentication code,
> and I would have a hard time arguing for or against that approach. Do what
> feels best for you.

## 🦉 Elaboration & Feedback

After the instruction, copy the URL below into your browser:
http://ws.kcd.im/?ws=Testing%20Node%20Apps&e=Testing%20Authentication%20API%20Routes&em=
