# URL-Shortener

Using mongoDB to store urls

Tested via [Postman](https://postman.com)

## Usage

Create `.env` file on the folder root and write the following

```dotenv
MONGO_URI=EXAMPLE:STRING
SESSION_SECRET=EXAMPLE:STRING
REDIS_URI=EXAMPLE:STRING
REDIS_HOST=EXAMPLE:STRING
REDIS_PORT=EXAMPLE:STRING
REDIS_PASS=EXAMPLE:STRING
```

### Add url

Make `post` request to host to add new url

> Warning! Protocol is required!
>
> Need to be logged!

#### Request example

```javascript
fetch('/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://google.com'
  })
})
```

#### Response example

```json
{
  "shortId": "riQRAd65L",
  "url": "https://google.com"
}
```

### Open short url

Open it in a browser

#### Example

`http://127.0.0.1:3000/riQRAd65L`

## TODO

+ ~~Web Interface~~
+ ~~Authorization~~

- Custom short url
- Update url

## Known Bugs

- User could create urls over count limit (just need use 2 tabs and add urls fast)