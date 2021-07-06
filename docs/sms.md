# SMS

## Sending an SMS message
You can use the send method, which takes the following parameters
* `send`: 
    `sender`
    `Message body`
    `Recipients`: an array of recipients, with the phone number preceded by the international prefix `+42-`
    `priority`: the message priority in the queue
    `options`: https://developers.openapi.it/services/gatewaysms
    `test (optional)`: weather it is a test or not. Default `false` 

```js
const sms client.sms.send('john doe', 'Test sms', ['+39-3939989741'], 0, {}, true) 
