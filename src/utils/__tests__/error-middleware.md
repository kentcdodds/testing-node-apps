# Testing Middleware

## Background

Whether you're using Express, Koa, Nest, Hapi.js or just about any other Node.js
framework, you're going to have some concept of middleware/plugins. Our app is
using Express and the tests you'll be writing in this exercise are specific to
Express, but focus more on the concepts you're learning here and you should be
able to apply them to whatever Node server framework you're using.

Express has several different types of middleware
([📜 read using middleware here](https://expressjs.com/en/guide/using-middleware.html)).

- Application-level middleware (our app isn't really using this kind)
- Router-level middleware (all our routes use this strategy of middleware)
- Error-handling middleware (this is what `error-middleware.js` is)
- Built-in middleware (we're not using any of these)
- Third-party middleware (we're using a few of these, like `cors`,
  `body-parser`, `express-jwt`, and `passport`).

For each of these kinds of middleware, they accept arguments like `request`,
`response`, and `next` and they're expected to either call a `response` method
to send a response to the caller, or call the `next` method to continue the
chain of middleware. Here's an example of a middleware function:

```javascript
function timeLogger(req, res, next) {
  console.log('Time:', Date.now())
  next()
}
```

One special case is for error middleware which acts as an error handler. For
that case, it also accepts an `error` argument.

```javascript
function errorHandler(err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
}
```

Middleware have different purposes. For example, the `setListItem` middleware in
`src/routes/list-items-controller.js` is responsible for finding the requested
`listItem` by its ID, determining whether the current user is able to access
that `listItem`, add adding that `listItem` to the `req` so later middleware can
access it.

## Exercise

The purpose of our `errorMiddleware` is to catch errors which have happened
throughout the app but haven't been caught, and responding with as good an error
response as possible. Ours handles three distinct cases:

1. An error was thrown, but a response has already been sent (so we don't need
   to send another one).
2. An `UnauthorizedError` was thrown by the `express-jwt` middleware
3. An unknown error was thrown and no response has been sent yet

We need a test for each of these cases. For each of these, you'll need to create
your own `error`, `req`, `res`, and `next`. You'll need to know how to create
mock functions. Here are a few quick examples of using mock functions:

```javascript
const myFn = jest.fn(() => 42)
const result = myFn({message: 'hello'})

expect(result).toBe(42)
expect(myFn).toHaveBeenCalledWith({message: 'hello'})
expect(myFn).toHaveBeenCalledTimes(1)
```

That's all you need to know for this exercise, but there's a lot more to learn
about them!

> 📜 Learn more about mock functions: https://jestjs.io/docs/en/mock-functions
> 📜 Mock Function API Docs: https://jestjs.io/docs/en/mock-function-api.html

## Extra Credit

### 💯 write a test object factory

A Test Object Factory (also referred to as
[an "Object Mother"](https://martinfowler.com/bliki/ObjectMother.html)). It's
basically just changing this:

```javascript
const myTestObject = {a: 'b', c: 'd'}
```

To this:

```javascript
function getMyTestObject(overrides) {
  return {a: 'b', c: 'q', ...overrides}
}

const myTestObject = getMyTestObject({c: 'd'})
```

It's a function which returns the standard version of some object you need to
create in multiple tests and allows for simple overrides.

One of the benefits to test object factories is code reuse/reducing duplication,
but my favorite benefit to test object factories is how it communicates what's
actually important to the people reading the test later. Especially in larger
codebases where the `req` object needs to have a dozen properties just to be
usable, it can be hard to determine what the important properties of that `req`
object is.

It's much easier to say: Hey, give me a normal `req` object, but I want it to
have these specific properties, because _these are important to my test_.
Through the code, you can communicate clearly what parts of the `req` object
make an impact on the unit under test and reduce code duplication at the same
time. Everyone wins.

You can see an example of something like this in my blog post
[AHA Testing](https://kentcdodds.com/blog/aha-testing).

In this extra credit, try to create a test object factory for the things you see
as common across these tests.

> 🦉 One thing to be careful of is that you don't want your test object
> factories to get overly complex. If they do, then you may actually be making
> things worse. Keep them really simple and if you have to, make different
> factories for creating different kinds of test objects.

### 💯 use `utils/generate`

There are some test object factories that are useful throughout the testbase.
The `req`, `res`, and `next` arguments definitely fall into this category. In
fact we've already written test object factories for them! They're in the
`test/utils/generate.js` file.

For this extra credit, use those test object factories.

💰 tip, because the way Jest is configured in this project, you can import that
directly like this:
`import {buildRes, buildReq, buildNext} from 'utils/generate'`

## 🦉 Elaboration & Feedback

After the instruction, copy the URL below into your browser:
http://ws.kcd.im/?ws=Testing%20Node%20Apps&e=Testing%20Middleware&em=
