// import OpenApi from '../dist/index';
let OpenApi = require('../dist/index').default;

const scopes = [
    "GET:ws.ufficiopostale.com/raccomandate",
    "GET:imprese.altravia.com/autocomplete",
    "GET:test.imprese.altravia.com/base",
    "GET:imprese.altravia.com/advance",
    "GET:imprese.altravia.com/pec",
    "GET:imprese.altravia.com/autocomplete",
    "GET:imprese.altravia.com/closed",
    "GET:imprese.altravia.com/gruppoiva",
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
];

// test('init', async function() {
    
//     let client = new OpenApi('test', process.env.OPENAPI_USERNAME, process.env.API_KEY);
    
//     const token = await client.generateToken(scopes);

//     await client.createClient(token);
// })

// test('initWithToken', async function() {
    
//     let client = new OpenApi('test', process.env.OPENAPI_USERNAME, process.env.API_KEY);
    
//     const token = process.env.TOKEN;
//     expect(typeof token === 'string').toBe(true);

//     await client.createClient(token);
//     expect(client.comuni).toBeDefined();
// })

// test('initWithOldToken', async function() {
    
//     let client = new OpenApi('test', process.env.OPENAPI_USERNAME, process.env.API_KEY);
    
//     const token = process.env.OLD_TOKEN;
//     expect(typeof token === 'string').toBe(true);

//     await client.createClient(token);
//     expect(client.comuni).toBeDefined()
// })

// test('testComuni', async function() {
    
//     let client = new OpenApi('test', process.env.OPENAPI_USERNAME, process.env.API_KEY);
    
//     const token = process.env.TOKEN;
//     expect(typeof token === 'string').toBe(true);

//     await client.createClient(token);
//     const cap = await client.comuni.getCitiesByCap('00121')
//     expect(cap[0].regione).toBeDefined();
    
//     const codice = await client.comuni.getCitiesByCap('00121')
//     expect(codice[0].regione).toBeDefined();
    
//     const province = await client.comuni.getProvincie();
//     expect(province).toBeDefined();
    
//     const istat = await client.comuni.getFromIstatCode('055032');
//     expect(istat).toBeDefined();
// })

test('testImprese', async function() {
    
    let client = new OpenApi('test', process.env.OPENAPI_USERNAME, process.env.API_KEY);
    
    const token = process.env.TOKEN;
    expect(typeof token === 'string').toBe(true);

    await client.createClient(token);
    // const piva = await client.imprese.getByPartitaIva('12485671007')
    // expect(piva).toBeDefined();
    // console.log(piva);
    
    // const pivaAvd = await client.imprese.getAdvancedByPartitaIva('12485671007')
    // expect(pivaAvd).toBeDefined();
    const pec = await client.imprese.getPec('12485671007')
    expect(pec).toBeDefined();
    console.log(pec);
})
