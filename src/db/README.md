# DB

This is our "database" abstraction. Every app is so different at this level that
it's much easier for your learning if we don't bring in an opinionated ORM or
real database here, so all the data is just stored in memory. Most of the tests
mock out these and that's something that many of your tests will do as well.

For the integration tests that you write (which will not mock whatever database
abstraction you're using), you will need to have the database up and running (in
a Docker container for example) and your app will connect to that database like
it does normally and you'll be operating with a real database. This will make
those integration tests a bit slower, but it's worth the confidence they
provide.
