# Project Title

Youtube-clone

Checkout [frontend](https://github.com/yavuzakin/youtube-clone-ui)

## Table of Content

- [Installation](#installation)
- [Screenshots](#screenshots)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Technologies](#technologies)

## Installation

```bash
  git clone https://github.com/yavuzakin/youtube-clone-api.git

  cd youtube-clone-api

  yarn install

  yarn start
```

## Screenshots

![Database](https://i.im.ge/2022/08/13/Oojn0z.db.png)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGODB_CONNECTION_STRING`, `JWT_SECRET_KEY`, `JWT_EXPIRES_IN`, `JWT_COOKIE_EXPIRES_IN`

## API Reference

**Protected** endpoints require authentication.

#### USER

#### Register

```
  POST /api/v1/users/register
```

| Request Body                                                                |
| :-------------------------------------------------------------------------- |
| **Required**. username, email, password fields of [user model](#user-model) |

#### Login

```
  POST /api/v1/users/login
```

| Request Body                                                         |
| :------------------------------------------------------------------- |
| **Required**. username, password fields of [user model](#user-model) |

#### Logout

```
  GET /api/v1/users/logout
```

#### Get User

```
  GET /api/v1/users/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of user to fetch |

#### Update User (Protected endpoint)

```
  PATCH /api/v1/users/:id
```

| Parameter | Type     | Description                        | Request Body                                                                                                    |
| :-------- | :------- | :--------------------------------- | :-------------------------------------------------------------------------------------------------------------- |
| `id`      | `string` | **Required**. Id of user to modify | **Required**. Any of password, profilePic, description fields of [user model](#user-model) you'd like to update |

#### Delete User (Protected endpoint)

```
  DELETE /api/v1/users/:id
```

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `id`      | `string` | **Required**. Id of user to delete |

#### Subscribe to User (Protected endpoint)

```
  PUT /api/v1/users/subscribe/:id
```

| Parameter | Type     | Description                           |
| :-------- | :------- | :------------------------------------ |
| `id`      | `string` | **Required**. Id of user to subscribe |

#### Unsubscribe from User (Protected endpoint)

```
  PUT /api/v1/users/unsubscribe/:id
```

| Parameter | Type     | Description                             |
| :-------- | :------- | :-------------------------------------- |
| `id`      | `string` | **Required**. Id of user to unsubscribe |

#### Get all Videos of a User

```
  GET /api/v1/users/:userId/videos
```

| Parameter | Type     | Description                                |
| :-------- | :------- | :----------------------------------------- |
| `id`      | `string` | **Required**. Id of user to get all videos |

#### Get all Comments of a User

```
  GET /api/v1/users/:userId/comments
```

| Parameter | Type     | Description                                  |
| :-------- | :------- | :------------------------------------------- |
| `id`      | `string` | **Required**. Id of user to get all comments |

#### VIDEO

#### Create Video (Protected endpoint)

```
  POST /api/v1/videos/
```

| Request Body                                                                                             |
| :------------------------------------------------------------------------------------------------------- |
| **Required**. title, description, imgUrl, videoUrl, tags(optional) fields of [video model](#video-model) |

#### Get all Videos

```
  GET /api/v1/videos/
```

#### Get Video

```
  GET /api/v1/videos/:id
```

| Parameter | Type     | Description                        |
| :-------- | :------- | :--------------------------------- |
| `id`      | `string` | **Required**. Id of video to fetch |

#### Update Video (Protected endpoint - not implemented)

```
  PATCH /api/v1/videos/:id
```

| Parameter | Type     | Description                         | Request Body                                                                 |
| :-------- | :------- | :---------------------------------- | :--------------------------------------------------------------------------- |
| `id`      | `string` | **Required**. Id of video to modify | **Required**. Any fields of [video model](#video-model) you'd like to update |

#### Delete Video (Protected endpoint)

```
  DELETE /api/v1/videos/:id
```

| Parameter | Type     | Description                         |
| :-------- | :------- | :---------------------------------- |
| `id`      | `string` | **Required**. Id of video to delete |

#### Like Video (Protected endpoint)

```
  PUT /api/v1/videos/like/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of video to like |

#### Dislike Video (Protected endpoint)

```
  PUT /api/v1/videos/dislike/:id
```

| Parameter | Type     | Description                          |
| :-------- | :------- | :----------------------------------- |
| `id`      | `string` | **Required**. Id of video to dislike |

#### Get all Comments of a Video

```
  GET /api/v1/videos/:videoId/comments
```

| Parameter | Type     | Description                                   |
| :-------- | :------- | :-------------------------------------------- |
| `id`      | `string` | **Required**. Id of video to get all comments |

#### Get all Videos of Subscribed Channels (Protected endpoint)

```
  GET /api/v1/videos/subscribed-channels
```

#### COMMENT

#### Create Comment (Protected endpoint)

```
  POST /api/v1/comments/
```

| Request Body                                                                                                 |
| :----------------------------------------------------------------------------------------------------------- |
| **Required**. id of the video you'd like to comment and description field of [comment model](#comment-model) |

#### Get all Comments

```
  GET /api/v1/comments/
```

#### Get Comment

```
  GET /api/v1/comments/:id
```

| Parameter | Type     | Description                          |
| :-------- | :------- | :----------------------------------- |
| `id`      | `string` | **Required**. Id of comment to fetch |

#### Update Comment (Protected endpoint)

```
  PATCH /api/v1/comments/:id
```

| Parameter | Type     | Description                           | Request Body                                                       |
| :-------- | :------- | :------------------------------------ | :----------------------------------------------------------------- |
| `id`      | `string` | **Required**. Id of comment to modify | **Required**. Description field of [comment model](#comment-model) |

#### Delete Comment (Protected endpoint)

```
  DELETE /api/v1/comments/:id
```

| Parameter | Type     | Description                           |
| :-------- | :------- | :------------------------------------ |
| `id`      | `string` | **Required**. Id of comment to delete |

## Data Models

#### USER MODEL

```json
  {
    username: string;
    email: string;
    password: string;
    profilePic: string;
    coverPic: string;
    description: string;
    subscribedUsers: string[];
    subscribers: string[];
  }
```

#### VIDEO MODEL

```json
  {
    user: mongoose.Schema.ObjectId;
    title: string;
    description: string;
    imgUrl: string;
    videoUrl: string;
    views: number;
    tags: string[];
    likes: string[];
    dislikes: string[];
  }
```

#### COMMENT MODEL

```json
  {
    user: mongoose.Schema.ObjectId
    video: mongoose.Schema.ObjectId;
    description: string;
  }
```

## Technologies

- Node.js
- Express.js
- MongoDB
- Postman
