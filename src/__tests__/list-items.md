# Testing CRUD API Routes

## Background

Create, Read, Update, Delete. These are the foundational operations of our
servers. There's a lot going on here too. Is the request valid? Do we have the
data that's being requested/updated? Is the user authorized to update that data?

Having a single integration-level test for the whole lifecycle of a unit of data
can be a great way to maintain confidence that our end-users will be able to
operate on that data properly.

## Exercise

This exercise will do basically the same kinds of things that our authentication
tests do. The biggest difference is that our axios client will need to be
authenticated. So we'll want to have a test

## Extra Credit

### 💯 snapshot the error message with dynamic data

As with a previous example, we have an error message and it'd be nice to take a
snapshot of it. Unfortunately, the server is generating the ID when we create
the list item, so a snapshot would fail every time we run this.

See if you can figure out how to still take a snapshot of the error so we don't
have to worry about hard-coding the error message in our assertion.

> 🔥 REMEMBER: If you're using codesandbox to go through this, the code update
> will not appear automatically, but it has happened! Just close and re-open the
> file and you'll get the update.

## 🦉 Elaboration & Feedback

After the instruction, copy the URL below into your browser:
http://ws.kcd.im/?ws=Testing%20Node%20Apps&e=Testing%20CRUD%20API%20Routes&em=
