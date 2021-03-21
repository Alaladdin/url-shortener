# URL-Shortener

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ad6901a9d73348948dd1c6194ee3a516)](https://app.codacy.com/gh/Alaladdin/url-shortener?utm_source=github.com&utm_medium=referral&utm_content=Alaladdin/url-shortener&utm_campaign=Badge_Grade_Settings)

Using mongoDB to store urls

Tested via [Postman](https://postman.com)

## Usage

Create `.env` file on the folder root and write the following

```dotenv
MONGO_URI=EXAMPLE:STRING
SESSION_SECRET=EXAMPLE:STRING
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

- Update url
- Custom short url
