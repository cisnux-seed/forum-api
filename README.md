![Continuous Integration](https://github.com/cisnux-seed/forum-api/actions/workflows/.github/workflows/ci.yml/badge.svg)
![Continuous Deployment](https://github.com/cisnux-seed/forum-api/actions/workflows/.github/workflows/cd.yml/badge.svg)
[![codecov](https://codecov.io/gh/cisnux-seed/forum-api/branch/comment-likes/graph/badge.svg?token=6GUMNJ6FV6)](https://codecov.io/gh/cisnux-seed/forum-api)
# Forum RESTful API

This is an open source Forum RESTful API project. This project written with javascript and Hapi Framework. Forum API providing authentications with implemented JWT (Token-Based Authentication). This RESTful API project implemented automation tests and clean architecture. You can also contribute this project. Feel free to contribute it.

## Feature List

- Register an account with username and password
- Login with registered account
- Update expired access token with refresh token
- Logout with account already logged in
- Add a thread
- Get a specific thread
- Add a comment
- Delete a comment with specific thread
- Add a reply to specific comment
- Delete a reply with specific thread and comment
- Add like to specific comment

# Installation

```console
git clone https://github.com/cisnux-seed/forum-api.git
npm install
```

# REST Endpoints

## Register an account with username and password

### Request

> POST /users

- cURL

```console
curl --location --request POST 'http://localhost:5000/users' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "ezio",
    "password": "secret",
    "fullname": "ezio auditore"
}'
```

- Javascript

```javascript
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  username: "ezio",
  password: "secret",
  fullname: "ezio auditore",
});

var requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow",
};

fetch("http://localhost:5000/users", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));
```

### Response

```json
{
  "status": "success",
  "data": {
    "addedUser": {
      "id": "user-123",
      "username": "ezio",
      "fullname": "ezio auditore"
    }
  }
}
```

## Login with registered account

### Request

> POST /authentications

- cURL

```console
curl --location --request POST 'http://localhost:5000/authentications' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "ezio",
    "password": "secret"
}'
```

- Javascript

```javascript
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  username: "ezio",
  password: "secret",
});

var requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow",
};

fetch("http://localhost:5000/authentications", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));
```

### Response

```json
{
  "status": "success",
  "data": {
    "accessToken": "xxxaccesstoken",
    "refreshToken": "xxxrefreshtoken"
  }
}
```

## Update expired access token with refresh token

### Request

> PUT /authentications

- cURL

```console
curl --location --request PUT 'http://localhost:5000/authentications' \
--header 'Content-Type: application/json' \
--data-raw '{
    "refreshToken": "xxxrefreshtoken"
}'
```

- Javascript

```javascript
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  refreshToken: "xxxrefreshtoken",
});

var requestOptions = {
  method: "PUT",
  headers: myHeaders,
  body: raw,
  redirect: "follow",
};

fetch("http://localhost:5000/authentications", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));
```

### Response

```json
{
  "status": "success",
  "data": {
    "accessToken": "xxxnewaccesstoken"
  }
}
```

## Logout with account already logged in

### Request

> DELETE /authentications

- cURL

```console
curl --location --request DELETE 'http://localhost:5000/authentications' \
--header 'Content-Type: application/json' \
--data-raw '{
    "refreshToken": "xxxrefreshtoken"
}'
```

- Javascript

```javascript
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  refreshToken: "xxxrefreshtoken",
});

var requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  body: raw,
  redirect: "follow",
};

fetch("http://localhost:5000/authentications", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));
```

### Response

```json
{
  "status": "success"
}
```

## Add a thread

### Request

> POST /threads

- cURL

```console
curl --location --request POST 'http://localhost:5000/threads' \
--header 'Authorization: Bearer xxxaccesstoken' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "a title",
    "body": "a body"
}'
```

- Javascript

```javascript
var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer xxxaccesstoken");
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  title: "a title",
  body: "a body",
});

var requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow",
};

fetch("http://localhost:5000/threads", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));
```

### Response

```json
{
  "status": "success",
  "data": {
    "addedThread": {
      "id": "thread-123",
      "owner": "user-123",
      "title": "a thread"
    }
  }
}
```

## Get a specific thread

### Request

> GET /threads/{id}

- cURL

```console
curl --location --request GET 'http://localhost:5000/threads/thread-123'
```

- Javascript

```javascript
var requestOptions = {
  method: "GET",
  redirect: "follow",
};

fetch("http://localhost:5000/threads/thread-123", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));
```

### Response

```json
{
  "status": "success",
  "data": {
    "thread": {
      "id": "thread-123",
      "title": "a title",
      "body": "sebuah body thread",
      "date": "Mon Sep 12 2022 07:23:19 GMT+0700 (Indochina Time)",
      "username": "dicoding",
      "comments": [
        {
          "id": "comment-123",
          "content": "a content",
          "date": "Mon Sep 12 2022 07:23:19 GMT+0700 (Indochina Time)",
          "username": "dicoding",
          "replies": [
            {
              "id": "reply-123",
              "content": "**balasan telah dihapus**",
              "date": "Mon Sep 12 2022 07:23:41 GMT+0700 (Indochina Time)",
              "username": "johndoe"
            },
            {
              "id": "reply-123",
              "content": "a content",
              "date": "Mon Sep 12 2022 07:23:44 GMT+0700 (Indochina Time)",
              "username": "dicoding"
            }
          ],
          "likeCount": 2
        }
      ]
    }
  }
}
```

## Add a comment

### Request

> POST /comments

- cURL

```console
curl --location --request POST 'http://localhost:5000/threads/thread-123/comments/comment-123/replies' \
--header 'Authorization: Bearer xxxaccesstoken' \
--header 'Content-Type: application/json' \
--data-raw '{
    "content": "a content"
}'
```

- Javascript

```javascript
var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer xxxaccesstoken");
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  content: "a content",
});

var requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow",
};

fetch(
  "http://localhost:5000/threads/thread-123/comments/comment-123/replies",
  requestOptions
)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));
```

### Response

```json
{
  "status": "success",
  "data": {
    "addedComment": {
      "id": "comment-ZWQ617BRXuFBjRH7KYTI7",
      "owner": "user-1_M9c0rYBStKs62Ryad2g",
      "content": "sebuah comment"
    }
  }
}
```

## Delete a comment with specific

### Request

> DELETE /comments/{id}

- cURL

```console
curl --location --request DELETE 'http://localhost:5000/threads/thread-123/comments/comment-123' \
--header 'Authorization: Bearer xxxaccesstoken'
```

- Javascript

```javascript
var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer xxxaccesstoken");

var requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  redirect: "follow",
};

fetch(
  "http://localhost:5000/threads/thread-123/comments/comment-123",
  requestOptions
)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));
```

### Response

```json
{
  "status": "success"
}
```

## Add a reply to specific comment

### Request

> POST /replies

- cURL

```console
curl --location --request POST 'http://localhost:5000/threads/thread-123/comments/comment-123/replies' \
--header 'Authorization: Bearer xxxaccesstoken' \
--header 'Content-Type: application/json' \
--data-raw '{
    "content": "a content"
}'
```

- Javascript

```javascript
var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer xxxaccesstoken");
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  content: "a content",
});

var requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow",
};

fetch(
  "http://localhost:5000/threads/thread-123/comments/comment-123/replies",
  requestOptions
)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));
```

### Response

```json
{
  "status": "success",
  "data": {
    "addedReply": {
      "id": "reply-123",
      "owner": "user-123",
      "content": "a content"
    }
  }
}
```

## Delete a reply with specific thread and comment

### Request

> DELETE /replies/{id}

- cURL

```console
curl --location --request DELETE 'http://localhost:5000/threads/thread-123/comments/comment-123/replies/reply-123' \
--header 'Authorization: Bearer xxxaccesstoken'
```

- Javascript

```javascript
var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer xxxaccesstoken");

var requestOptions = {
  method: "DELETE",
  headers: myHeaders,
  redirect: "follow",
};

fetch(
  "http://localhost:5000/threads/thread-123/comments/comment-123/replies/reply-123",
  requestOptions
)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));
```

### Response

```json
{
  "status": "success"
}
```

## Add like to specific comment

### Request

> PUT /threads/{threadId}/comments/{commentId}/likes

- cURL

```console
curl --location --request PUT 'http://localhost:5000/threads/thread-123/comments/comment-123/likes' \
--header 'Authorization: Bearer xxxaccesstoken'
```

- Javascript

```javascript
var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer xxxaccesstoken");

var requestOptions = {
  method: "PUT",
  headers: myHeaders,
  redirect: "follow",
};

fetch(
  "http://localhost:5000/threads/thread-123/comments/comment-123/likes",
  requestOptions
)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));
```

### Response

```json
{
  "status": "success"
}
```

# Automation Tests

you can also run manual automation tests with run this command</br>
`npm run test:watch` and open folder coverage to see coverage result</br></br>
![image](https://user-images.githubusercontent.com/68740152/188715400-7175ae58-091f-4a0c-8afe-897082812107.png)
