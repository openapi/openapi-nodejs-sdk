// import OpenApi from '../dist/index';
let OpenApi = require('../dist/index').default;

const scopes = [
    "GET:ws.ufficiopostale.com/raccomandate",
    "GET:imprese.altravia.com/autocomplete",
    // "GET:test.imprese.altravia.com/base",
    // "GET:imprese.altravia.com/advance",
    // "GET:imprese.altravia.com/pec",
    // "GET:imprese.altravia.com/autocomplete",
    // "GET:imprese.altravia.com/closed",
    "*:imprese.altravia.com/*",
    "GET:comuni.openapi.it/cap",
    "GET:comuni.openapi.it/istat",
    "GET:comuni.openapi.it/province",
    "GET:comuni.openapi.it/regioni",
    "GET:comuni.openapi.it/catastale",
    "GET:ws.ufficiopostale.com/tracking",
    "POST:geocoding.realgest.it/geocode",
    "POST:ws.messaggisms.com/messages",
    "GET:ws.messaggisms.com/messages",
    "PUT:ws.messaggisms.com/messages",
    "GET:ws.firmadigitale.com/richiesta",
    "POST:ws.firmadigitale.com/richiesta",
    "GET:ws.marchetemporali.com/availability",
    "GET:ws.marchetemporali.com/marche",
    "POST:ws.marchetemporali.com/check_lotto",
    "POST:ws.marchetemporali.com/marca",
    "POST:ws.marchetemporali.com/verifica",
    "POST:ws.marchetemporali.com/analisi",
    'imprese.altravia.com',
    // 'pa.openapi.it',
];

// test('init', async function() {
    
//     let client = await OpenApi.init('test', process.env.OPENAPI_USERNAME, process.env.API_KEY);
//     const token = await client.generateToken(scopes);
//     expect(typeof token === 'string').toBeTruthy()
// })

test('initWithString', async function() {
    
    let client = await OpenApi.init('production', process.env.OPENAPI_USERNAME, process.env.API_KEY);
    const token = await client.generateToken('imprese.altravia.com');
    expect(typeof token === 'string').toBeTruthy()
    console.log(client.scopes);
})

// test('initWithToken', async function() {
//     let client = await OpenApi.init('test', process.env.OPENAPI_USERNAME, process.env.API_KEY, process.env.TOKEN);
//     expect(client.comuni).toBeDefined();
// })

// test('initWithOldToken', async function() {
    
//     let client = new OpenApi('test', process.env.OPENAPI_USERNAME, process.env.API_KEY);
    
//     const token = process.env.OLD_TOKEN;
//     expect(typeof token === 'string').toBe(true);

//     expect(client.comuni).toBeDefined()
// })

// test('initWithSkip', async function() {
    
//     let client = new OpenApi('test', process.env.OPENAPI_USERNAME, process.env.API_KEY);
    
//     const token = process.env.TOKEN;
//     expect(typeof token === 'string').toBe(true);

//     expect(client.comuni).toBeDefined()
//     expect(client.imprese).toBeDefined()

//     const pec = await client.imprese.getPec('12485671007')
//     expect(pec).toBeDefined();

//     const codice = await client.comuni.getCitiesByCap('00121')
//     expect(codice[0].regione).toBeDefined();
// })

// test('testComuni', async function() {
//     const token = process.env.TOKEN;
//     expect(typeof token === 'string').toBe(true);
    
//     let client = await OpenApi.init('test', process.env.OPENAPI_USERNAME, process.env.API_KEY, token);
    

//     const cap = await client.comuni.getCitiesByCap('00121')
//     expect(cap[0].regione).toBe('Lazio');
    
//     const province = await client.comuni.listProvince();
//     expect(province.MI).toBeDefined();

//     const comuni = await client.comuni.listComuni('MI');
//     expect(comuni[0]).toBeDefined();
    
//     const istat = await client.comuni.getFromIstatCode('055032');
//     expect(istat).toBeDefined();

//     console.log(cap, province, comuni);
// })

// test('testImprese', async function() {
//     let client = await OpenApi.init('test', process.env.OPENAPI_USERNAME, process.env.API_KEY, process.env.TOKEN);
    
//     const piva = await client.imprese.getByPartitaIva('12485671007')
//     expect(piva).toBeDefined();
//     console.log(piva);
    
//     const pivaAvd = await client.imprese.getAdvancedByPartitaIva('12485671007')
//     expect(pivaAvd).toBeDefined();
//     const pec = await client.imprese.getPec('12485671007')
//     expect(pec).toBeDefined();
//     console.log(pec);

//     const imprese = await client.imprese.search({ provincia: 'RM' })
    
//     expect(imprese).toBeDefined();
//     console.log(imprese);
// })

// test('testPa', async function() {
//     let client = await OpenApi.init('test', process.env.OPENAPI_USERNAME, process.env.API_KEY, process.env.TOKEN);
//     client.generateToken(scopes)
//     const piva = await client.pa.findPa('00559720982')
//     expect(piva).toBeDefined();
// })
// test('testFD', async function() {
//     let client = await OpenApi.init('test', process.env.OPENAPI_USERNAME, process.env.API_KEY, process.env.TOKEN);
//     const prodotti = await client.firmaDigitale.getProducts();
//     expect(prodotti).toBeDefined();

//     const richiesta  = await client.firmaDigitale.requestProduct('RINFIR', {})
//     expect(richiesta.id).toBeDefined()

//     const infoRichiesta = await client.firmaDigitale.getRequest(richiesta.id)
//     expect(infoRichiesta).toBeDefined()
//     console.log(infoRichiesta);
// })

// test('testMT', async function() {
//     let client = await OpenApi.init('test', process.env.OPENAPI_USERNAME, process.env.API_KEY, process.env.TOKEN);
//     const lotto = await client.marcheTemporali.checkLotto('FAKETSA.altravia16', 'FAKE9R155S9VF');
//     expect(lotto.used).toBeDefined()
// })

// test('testValutometro', async function() {
//     let client = await OpenApi.init('test', process.env.OPENAPI_USERNAME, process.env.API_KEY, process.env.TOKEN);
//     const p = await client.valutometro.listPropertyTypes()
//     expect(p[0]).toBeDefined()
    
//     const c = await client.valutometro.listContractTypes()
//     expect(c[0]).toBeDefined()

//     const q = await client.valutometro.quote('via del rivo 10 Terni', '20', 'sale')
//     expect(q).toBeDefined()
//     console.log(q);
// })

// test('testVisengine', async function() {
//     let client = await OpenApi.init('test', process.env.OPENAPI_USERNAME, process.env.API_KEY, process.env.TOKEN);
//     const s = await client.visengine.listServices()
//     expect(s[0]).toBeDefined()

//     const visuraDescription = await client.visengine.getServiceDescription(s[0].hash_visura)
//     console.log(JSON.stringify(visuraDescription, null, 2));

//     const json_visura = {'$0': 'test', '$1': 'lorem ipsum'}
//     const callback = {
//         url: 'enpoint.example.com',
//         method: 'POST',
//         field: 'data',
//     }
//     const visura = await client.visengine.createRequest(s[0].hash_visura, json_visura, {}, callback,null, 'close', true);
//     console.log(visura);
// })


// test('testsms', async function() {
//     let client = await OpenApi.init('test', process.env.OPENAPI_USERNAME, process.env.API_KEY, process.env.TOKEN);
//     // const list = await client.sms.getMessages()
//     // console.log(list);
//     const sms = await client.sms.send('test', 'Test sms', ['+39-3939989741'], 0, {}, true)
//     expect(sms).toBeDefined()
//     console.log(JSON.stringify(sms, null, 2));
// })
