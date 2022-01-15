# Secret Santa

###### Node version: >= 14.18.2
###### Npm version: >= 6.14.15

- [Installation](#installation)
- [Deploy](#deploy)
- [API](#api)

## Installation

After repository is cloned, run next command in project folder:

```
npm install
```

## Deploy

After project is installed, run next command in project folder:

```
npm run prod
```

After that, run next command in project folder to start on localhost:
```
node ./public/server [port number - 5000 is default]
```

## API

#### Register
**POST** localhost:[port]/user/register
BODY (JSON):
```
{
    "user": {
        "first_name": string,
        "last_name": string
    },
    "gifts": string[]
}
```
RESPONSE:
```
{
    "data": {
        "id": number
    },
    "errors": []
}
```

#### Shuffle
**POST** localhost:[port]/shuffle
RESPONSE: 204OK

#### Get couple
**GET** localhost:[port]/user
**Query params:**

| Param | Type |
| ------ | ------ |
| id | number |

RESPONSE:

```
{
    "data": {
        "user": {
            "first_name": string,
            "last_name": string
        },
        "gifts": string[]
    },
    "errors": []
}
```

