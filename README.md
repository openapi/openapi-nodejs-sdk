# OpenApi NodeJS Client

## Installation
...todo
```js
const OpenApi = require('openapi-client').default;
```

## Usage
In order to use the client, you need an active openapi.it account. You can register for free on developers.openapi.it.

We can now initialize the client with the credentials that we find in our dashboard and a **valid token**
```js
const client = await OpenApi.init('production', your@email.com, your_production_api_key, your_token);
```
Where `production` (or `test`) is the environment we want to work in; please note that API Keys and tokens for the production and test environment are different.

If you want to see your active tokens, please visit developers.openapi.it/tokens.

Besides, the client will automatically renew the provided token when needed.

### Generate a token
If we don't have a token yet, we can easily generate a new one giving either  the full scope or pass just the base-url as a shorthand, which will give us access to all the endpoints and methods of the web service:
```js
const scopes = [
    "PUT:ws.messaggisms.com/messages",
    "GET:ws.firmadigitale.com/richiesta",
    "POST:ws.firmadigitale.com/richiesta",
    'imprese.altravia.com',
    'pa.openapi.it',
    // Both syntax are accepted
];

let client = await OpenApi.init('test', your@email.com, your_api_key);
const token = await client.generateToken(scopes);

// The new token will be set and returned, 
// we can now save on a database if needed ...

// The client is now ready to make requests
```

## Make requests
Once the client has been initialized, we can start making requests: all the available methods will be loaded based on the provided token.

As an example, let's request the list of all cities in a given CAP

```js
try {
    const cities = await client.comuni.getCitiesByCap('00132')
} catch(err) {
    // err handling logic...
}

// The client uses promises, so we can choose the syntax we prefer
client.comuni.getCitiesByCap('00132')
    .then(res => {
        
    })
    .catch(err => {

    })
```

Or a list of companies in Rome

```js
const imprese = await client.imprese.search({ provincia: 'RM' })
```

The library is typed, so you will get hints in supported IDEs of all the available methods.

Currently, those are the available web services:
* comuni
* imprese
* geocoding
* pa
* firmaDigitale
* marcheTemporali
* pecMassiva
* valutometro
* splitpayment
* europeanVat
* visengine
* postontarget
* domains

While most of them are straight forward, some may need additional explanation. Please check out the more comprehensive documentation:

[VISENGINE](/blob/master/docs/visengine.md)