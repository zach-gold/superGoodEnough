# HeapLeak

Welcome to the SuperGoodEnough README! SuperGoodEnough is a partial clone of theCrag.com, built and maintained by Zach Gold

## Tech Stack

### Frameworks and Libraries

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)

### Database:

![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

### Hosting:

![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)

# Wiki Articles

[Feature List](https://github.com/zach-gold/superGoodEnough/wiki/Feature-List) | [Database Schema](https://github.com/zach-gold/superGoodEnough/wiki/Database-Schema) | [User Stories](https://github.com/zach-gold/superGoodEnough/wiki/User-Stories)

# API Documentation

## AUTH

## Endpoint: `GET /`

**Description**: Authenticates a user. Returns user information if authenticated, otherwise returns an unauthorized error.

**Response**:
**200 OK**: Returns the current user's information if authenticated.

```json
{
  "id": 1,
  "username": "exampleUser",
  "email": "user@example.com"
}
```

**Error (401 UNAUTHORIZED):**

```json
{
  "message": "Unauthorized"
}
```

## Endpoint: `POST /login`

**Description**: Logs a user in. Requires email and password. If authentication is successful, the user is logged in and their information is returned.

**Request**:

**Body**

```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response**:
**200 OK**: Returns the logged in user's information if credentials are correct.
**Body**

```json
{
  "id": 1,
  "username": "exampleUser",
  "email": "user@example.com"
}
```

**Error (401 UNAUTHORIZED):**

```json
{
  "email": ["Invalid email address"],
  "password": ["Incorrect password"]
}
```

## Endpoint: `GET /logout`

**Description**: Logs the current user out and returns a confirmation message.

**Response**:
**200 OK**: Returns a message indicating the user has been logged out.

```json
{
  "message": "User logged out"
}
```

## Endpoint: `POST /signup`

**Description**: Creates a new user and logs them in. Requires username, email, and password.

**Request**:

**Body (JSON)**:

```json
{
  "username": "newUser",
  "email": "newuser@example.com",
  "password": "newpassword"
}
```

**Response**:
**200 OK**: Returns the newly created user's information.

```json
{
  "id": 2,
  "username": "newUser",
  "email": "newuser@example.com"
}
```

**Error (401 UNAUTHORIZED):**

```json
{
  "username": ["Username already taken"],
  "email": ["Email already in use"],
  "password": ["Password is too short"]
}
```

## Endpoint: `GET /unauthorized`

**Description**: Returns unauthorized JSON when Flask Login authentication fails.

**Response**:

**401 Unauthorized**: Returns an error message indicating unauthorized access.

```json
{
  "errors": {
    "message": "Unauthorized"
  }
}
```

## USERS

## Endpoint: `GET /users`

**Description:**
Query for all users and return them in a list of user dictionaries.

**Authentication:** Required (logged in)

**Parameters:**

- None

**Response:**

**Success (200 OK):**

```json
{
  "users": [
    {
      "id": 1,
      "username": "user1",
      "email": "user1@example.com"
      // Other user fields...
    },
    {
      "id": 2,
      "username": "user2",
      "email": "user2@example.com"
      // Other user fields...
    }
    // More users...
  ]
}
```

**Error (401 UNAUTHORIZED):**

```json
{
  "message": "Login required"
}
```

## Endpoint: `GET /users/<int:id>`

**Description:**
Query for a user by ID and return that user in a dictionary.

**Authentication:** Required (logged in)

**Parameters:**

- `id` (integer, path parameter): The ID of the user to retrieve.

**Response:**

**Success (200 OK):**

```json
{
  "id": 1,
  "username": "user1",
  "email": "user1@example.com"
  // Other user fields...
}
```

**Error (401 UNAUTHORIZED):**

```json
{
  "message": "Login required"
}
```

**Error (404 NOT FOUND):**

```json
{
  "message": "User could not be found"
}
```

## ROUTES

## Endpoint: `GET /routes`

**Description:**
Retrieve all routes from the database, including route images, author information, and ascents related to each route.

**Response:**

**Success (200 OK):**

```json
{
  "Routes": [
    {
      "id": 1,
      "name": "Route Name",
      "description": "Route Description",
      "created_by": 1,
      "author": "Author Username",
      "images": [
        {
          "id": 1,
          "url": "Image URL",
          "route_id": 1
        }
      ],
      "ascents": [
        {
          "id": 1,
          "user_id": 2,
          "route_id": 1,
          "author": {
            "id": 2,
            "username": "Ascent Author Username"
          },
          "images": [
            {
              "id": 1,
              "url": "Ascent Image URL",
              "ascent_id": 1
            }
          ]
        }
      ]
    }
  ]
}
```

## Endpoint: `GET /routes/<int:id>`

**Description:**
Retrieve a specific route from the database by its ID, including route images, author information, and ascents related to the route.

**Parameters:**

- `id` (int): ID of the route to retrieve.

**Response:**

**Success (200 OK):**

```json
{
  "Route": {
    "id": 1,
    "name": "Route Name",
    "description": "Route Description",
    "created_by": 1,
    "author": "Author Username",
    "images": [
      {
        "id": 1,
        "url": "Image URL",
        "route_id": 1
      }
    ],
    "ascents": [
      {
        "id": 1,
        "user_id": 2,
        "route_id": 1,
        "author": {
          "id": 2,
          "username": "Ascent Author Username"
        },
        "images": [
          {
            "id": 1,
            "url": "Ascent Image URL",
            "ascent_id": 1
          }
        ]
      }
    ]
  }
}
```

**Error (404 NOT FOUND):**

```json
{
  "message": "Route could not be found"
}
```

## Endpoint: `POST /routes`

**Description:**
Create a new route and add it to the database. This action requires the user to be logged in and the submitted data to be valid.

**Authentication:** Required (logged in)

**Request Body:**

```json
{
  "name": "Name of the route.",
  "grade": "Grade of the route.",
  "location": "Location of the route.",
  "area_id": "ID of the area where the route is located.",
  "description": "Description of the route."
}
```

**Response:**

**Success (201 CREATED):**

```json
{
  "Route": {
    "id": 1,
    "name": "New Route Name",
    "grade": "5.12a",
    "location": "Yosemite",
    "area_id": 1,
    "description": "This is a new climbing route.",
    "created_by": 1,
    "author": "Author Username"
  }
}
```

**Error (400 BAD REQUEST):**

```json
{
  "message": "BadRequest",
  "errors": {
    "name": ["This field is required."],
    "grade": ["This field is required."],
    "location": ["This field is required."],
    "area_id": ["This field is required."],
    "description": ["This field is required."]
  }
}
```

## Endpoint: `PATCH /routes/<int:id>`

**Description:**
Update an existing route in the database. The user must be logged in and must be the owner of the route. If the data is valid, the route is updated accordingly.

**Authentication:** Required (logged in)

**Parameters:**

- `id` (int): ID of the route to update.

**Request Body:**

```json
{
  {
  "name": "Updated Name of the route.",
  "grade": "Updated Grade of the route.",
  "location": "Updated Location of the route.",
  "area_id": "Updated ID of the area where the route is located.",
  "description": "Updated Description of the route."
}
}
```

**Response:**

**Success (200 OK):**

```json
{
  "Route": {
    "id": 1,
    "name": "Updated Route Name",
    "grade": "5.13b",
    "location": "Joshua Tree",
    "area_id": 1,
    "description": "This is an updated climbing route.",
    "created_by": 1,
    "author": "Author Username",
    "images": [
      {
        "id": 1,
        "url": "image_url"
      }
    ],
    "ascents": [
      {
        "id": 1,
        "author": {
          "id": 2,
          "username": "Ascent Author"
        },
        "images": [
          {
            "id": 1,
            "url": "image_url"
          }
        ]
      }
    ]
  }
}
```

**Error (400 BAD REQEST):**

```json
{
  "message": "BadRequest",
  "errors": {
    "name": ["Invalid name."],
    "grade": ["Invalid grade."],
    "location": ["Invalid location."],
    "area_id": ["Invalid area ID."],
    "description": ["Invalid description."]
  }
}
```

**Error (401 UNAUTHORIZED):**

```json
{
  "message": "Not the owner of this route"
}
```

## Endpoint: `GET /routes/<int:id>/ascents`

**Description:**
Retrieve all ascents associated with a specific route from the database. Each ascent includes related images and author information.

**Parameters:**

- `id` (int): ID of the route for which ascents are to be retrieved.

**Response:**

**Success (200 OK):**

```json
{
  "Ascents": [
    {
      "id": 1,
      "date": "2024-08-14",
      "notes": "Great ascent!",
      "user_id": 2,
      "route_id": 1,
      "images": [
        {
          "id": 1,
          "url": "ascent_image_url"
        }
      ],
      "author": "Ascent Author Username"
    },
    {
      "id": 2,
      "date": "2024-08-15",
      "notes": "Challenging but rewarding.",
      "user_id": 3,
      "route_id": 1,
      "images": [
        {
          "id": 2,
          "url": "ascent_image_url"
        }
      ],
      "author": "Another Ascent Author"
    }
  ]
}
```

**Error (404 NOT FOUND):**

```json
{
  "message": "Route could not be found"
}
```

## Endpoint: `POST /routes/<int:id>/ascents`

**Description:**
Create a new ascent for a specific route. This action is only available to logged-in users. The new ascent will be associated with the specified route and stored in the database.

**Authentication:** Required (logged in)

**Parameters:**

- `id` (int): ID of the route to which the ascent is being added.

**Request Body:**

```json
{
 "date": "The date of the ascent.",
"style": "The style of the ascent (e.g., redpoint, onsight).",
"notes": "Optional notes about the ascent."
}
```

**Response:**

**Success (201 CREATED):**

```json
{
  "Ascent": {
    "id": 1,
    "user_id": 2,
    "route_id": 1,
    "date": "2024-08-14",
    "style": "onsight",
    "notes": "Challenging but rewarding.",
    "parent_route": {
      "id": 1,
      "name": "Route Name",
      "grade": "5.10a",
      "location": "Yosemite",
      "area_id": 3,
      "description": "A challenging route with great views.",
      "created_by": 1,
      "owner": {
        "id": 1,
        "username": "RouteCreator"
      }
    },
    "images": [
      {
        "id": 1,
        "url": "ascent_image_url"
      }
    ]
  }
}
```

**Error (400 BAD REQUEST):**

```json
{
  "message": "BadRequest",
  "errors": {
    "date": ["Date is required"],
    "style": ["Style is required"]
  }
}
```

## Endpoint: `DELETE /routes/<int:id>`

**Description:**
Delete a specific route from the database. This action is only available to the logged-in user who created the route.

**Authentication:** Required (logged in)

**Parameters:**

- `id` (int): ID of the route to be deleted.

**Response:**

**Success (200 OK):**

```json
{
  "id": 1
}
```

**Error (404 NOT FOUND):**

```json
{
  "id": null
}
```

## ASCENTS

## Endpoint: `GET /ascents`

**Description:**
Retrieve all ascents from the database, including details about each ascent, its associated route, and any images related to the ascent.


**Response:**

**Success (200 OK):**

```json
{
  "Ascents": [
    {
      "id": 1,
      "user_id": 2,
      "route_id": 3,
      "date": "2024-08-14",
      "style": "redpoint",
      "notes": "Some notes about the ascent",
      "parent_route": {
        "id": 3,
        "name": "Route Name",
        "grade": "5.12a",
        "location": "Route Location",
        "area_id": 1,
        "description": "Description of the route",
        "created_by": 4,
        "owner": {
          "id": 4,
          "username": "route_owner_username",
          "email": "owner@example.com"
        }
      },
      "images": [
        {
          "id": 1,
          "url": "http://example.com/ascent_image.jpg",
          "ascent_id": 1
        }
      ]
    }
  ]
}
```

## Endpoint: `PATCH /ascents/<int:id>`

**Description:**
Update an ascent's details if the user is the owner. The ascent's style and notes can be modified.

**Authentication:** Required (logged in)

**Parameters:**

- `id` (int): ID of the ascent to be updated.

**Request Body:**
```json
{
  "style": "new_style",
  "notes": "Updated notes for the ascent"
}
```

**Response:**

**Success (200 OK):**

```json
{
  "Ascent": {
    "id": 1,
    "user_id": 2,
    "route_id": 3,
    "date": "2024-08-14",
    "style": "new_style",
    "notes": "Updated notes for the ascent",
    "parent_route": {
      "id": 3,
      "name": "Route Name",
      "grade": "5.12a",
      "location": "Route Location",
      "area_id": 1,
      "description": "Description of the route",
      "created_by": 4,
      "owner": {
        "id": 4,
        "username": "route_owner_username",
        "email": "owner@example.com"
      }
    },
    "images": [
      {
        "id": 1,
        "url": "http://example.com/ascent_image.jpg",
        "ascent_id": 1
      }
    ]
  }
}
```

**Error (400 BAD REQEST):**

```json
{
  "message": "Bad Request",
  "errors": {
    "style": ["Invalid style"],
    "notes": ["Invalid notes"]
  }
}
```

**Error (401 UNAUTHORIZED):**

```json
{
  "message": "Not the owner of this Ascent"
}
```

## Endpoint: `DELETE /ascents/<int:id>`

**Description:**
Delete an answer if the user is logged in and is the owner of the ascent.

**Authentication:** Required (logged in)

**Parameters:**

- `id` (int): ID of the ascent to be deleted.

**Response:**

**Success (200 OK):**

```json
{
  "id": 1
}
```

**Error (401 UNAUTHORIZED):**

```json
{
  "id": null
}
```


