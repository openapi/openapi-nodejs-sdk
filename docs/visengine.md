# Visengine

## Usage

We can start by listing all the available services:

```js
const list = await client.visengine.listServices()

/**
[
      {
        nome_visura: 'Visura Camerale Ordinaria - società di Capitale ',
        nome_categoria: 'Camerali',
        hash_visura: 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
      },
      {
        nome_visura: 'Visura Camerale Ordinaria - società di Persone',
        nome_categoria: 'Camerali',
        hash_visura: 'a87ff679a2f3e71d9181a67b7542122c'
      },
    ...
*/
```

or by getting information about a specific service
```js
const visuraDescription = await client.visengine.getServiceDescription(list[0].hash_visura)
/*{
      "nome_visura": "Visura Camerale Ordinaria - società di Capitale ",
      "nome_categoria": "Camerali",
      "json_struttura": {
        "campi": {
          "$0": {
            "nome": "NRea",
            "tipo": "denominazione",
            "null": false,
            "istruzioni": "Inserire il Numero di Rea dell`azienda"
          },
          "$1": {
            "nome": "Cciaa",
            "tipo": "denominazione",
            "null": false,
            "istruzioni": "Inserire la Cciaa dell`Azienda",
            "ordine": "1"
          }
        },
        "validazione": "$0 && $1  ",
        "istruzioni": "<p>Per richiedere la Visura Camerale Ordinaria - Societ&agrave; di Capitale inserisci i seguenti dati:&nbsp;&nbsp;<strong>Nrea</strong>&nbsp;e <strong>Cciaa</strong></p>\r\n",
        "istruzioni_ricerca": ""
      },
      "hash_visura": "eccbc87e4b5ce2fe28308fd9f2a7baf3",
    }
*/
```
Please note that the instruction field has been automatically decoded and can be embedded in html.

```js
//We can now create a request object 
const json_visura = {'$0': 'test', '$1': 'lorem ipsum'}
const options = {}
const callback = {
    url: 'endpoint.example.com',
    method: 'POST',
    field: 'data',
}

const visura = await client.visengine.createRequest(hash_visura, json_visura, options, callback, 'notify@user_email.com', 'close', true);

// The specified webhook will be called when the visura is ready
```

The `close ` parameter specifies that the request is closed and cannot be updated in the future, you can also leave it `open`, and update the request later with `updateRequest`
 