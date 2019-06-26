# Testing Controllers

The term "controllers" is really just a middleware that applies some business
logic and actually sends a response. They can involve really simple or
incredibly complex business rules resulting in code that can be fairly difficult
to test. Often controller code will also interact with a database or other
services.

They are tested in basically the same way that a regular middleware is tested,
except because our controller middleware is interacting with the database we're
going to mock out those interactions. We'll do this for a few reasons:

1. Test speed: Database/Service interactions will make our tests run slower.
2. Test simplicity: Database/Service interactions will make our tests require
   more complex setup/teardown logic.
3. Test stability: Database/Service interactions will make our tests more flaky
   by relying on services that may be outside our control.

> 🦉 While we get benefits by mocking databases and services, it's wise to not
> forget what we're giving up.

## Background

## Exercise

## Extra Credit

### 💯
