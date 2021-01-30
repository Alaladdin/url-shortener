# URL-Shortener

Using mongoDB to store urls

Tested via [Postman](https://postman.com)

## Usage

Create `.env` file on the folder root and write the following

```dotenv
MONGO_URI=   // Enter mongo URI here
```

### Add url

Make `post` request to host to add new url

> Warning! Protocol is required!

#### Request example

```javascript
fetch('http://127.0.0.1:3000', {
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

- Web Interface
- Authorization
- Custom short url