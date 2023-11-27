# HatHub

---

## Application Description
The goal of HatHub is to allow a user to set up a profile where they can buy many different kinds of hats in one convenient place - a hub, HatHub.

## Contributors
Saul Drantch
Streck Salmon
Maks Seniw
Abdullah Yassine
Hyder Baig
Blake Raphael

## Technology Stack
- Node.js
- PostgreSQL
- JavaScript
- Embedded JavaScript
- HTML
- CSS
- Docker Containers
- Bootstrap
- (Deployment platform (TBD))

## Prerequisites
Minimum specifications: Chrome 10-25, Safari 5.1-6
Preferred specifcations: W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+

## Testing
When testing, you must use a brand-new docker volume so that the test user can be added and the register route can be tested correctly. If you want to re-use a volume without destroying it, remove the `module.exports =` portion of the `module.exports = app.listen(3000);` line in `index.js`. This will allow you to run the app, but all the tests will fail.

## Link to deployed application
www.tbd.com