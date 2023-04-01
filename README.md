# REST-API

A NodeJS Typescript project that implements an API that allows users to create, read, update and delete blog posts.
Users can also view all blog posts or a specific blog post by its ID. API also allows users to filter blog posts by category and sort by date created.

Also includes a postman collection to ease trying out all available endpoints.

## Exposed endpoints

#### Assets

- POST `/assets` Creates a new asset.
- GET `/assets/:id` Gets an asset by id.

#### Posts

- POST `/posts` Creates a new blog post
- PUT `/posts/:id` Updates a blog post with the specified id.
- DELETE `/posts/:id` Deletes a blog post with the specified id.
- GET `/posts` Gets all blog post. Can also filter by category and sort by date.
- GET `/posts/:id` Get a blog post by id.

## Install dependencies

```sh
npm install
```

## Running route tests

```sh
docker-compose up -d
npm run test
```

## Test results

![ScreenShot](./screenshots/test_results.png?raw=true 'Test results')
