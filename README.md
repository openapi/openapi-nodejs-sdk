# OpenApi NodeJS Client

## Installation

```
npm install @altravia/openapi
```

```js
const OpenApi = require('@altravia/openapi').default;
```

## Usage
In order to use the client, you need an active openapi.it account. You can register for free on [developers.openapi.it](developers.openapi.it).

We can now initialize the client with the credentials that we find in our dashboard and a **valid token**
```js
const client = await OpenApi.init('production', your@email.com, your_production_api_key, your_token);
```
Where `production` (or `test`) is the environment we want to work in; please note that API Keys and tokens for the production and test environment are different.

If you want to see your active tokens, please visit [developers.openapi.it/tokens](developers.openapi.it/tokens).

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
Please note that wildcards for **base urls** are not supported at the moment:
```js
// This will work
const token = await client.generateToken('*:pa.openapi.it/*');
// This is equivalent to the previous (just a shortcut)
const token = await client.generateToken('pa.openapi.it');

// This will NOT work
const token = await client.generateToken('*:*/*');
```
### Heads up: `undefined` methods
The client will instantiate **only the instances needed** based on the provided token: if you get `undefined` method when you attempt to run a request, please check if you have all the required permissions.

## Make requests
Once the client has been initialized, we can start making requests: all the available methods will be loaded based on the provided token.

As an example, let's request the list of all cities in a given CAP

```js
const cities = await client.comuni.getCitiesByCap('00132')
try {
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
* [comuni](https://developers.openapi.it/services/comuni)
* [imprese](https://developers.openapi.it/services/imprese)
* [geocoding](https://developers.openapi.it/services/geocoding)
* [pa](https://developers.openapi.it/services/pa)
* [firmaDigitale](https://developers.openapi.it/services/firmadigitale)
* [marcheTemporali](https://developers.openapi.it/services/marchetemporali)
* [pecMassiva](https://developers.openapi.it/services/pecmassiva)
* [valutometro](https://developers.openapi.it/services/valutometro)
* [splitpayment](https://developers.openapi.it/services/splitpayment)
* [europeanVat](https://developers.openapi.it/services/europeanvat)
* [visengine](https://developers.openapi.it/services/visengine)
* [postontarget](https://developers.openapi.it/services/postontarget)
* [domains](https://developers.openapi.it/services/domains)

While most of them are straight forward, some may need additional explanation. Please check out the more comprehensive documentation:

[VISENGINE](/docs/visengine.md)
[SMS](/docs/sms.md)
