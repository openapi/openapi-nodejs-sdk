const fs = require('fs');
let Openapi = require('../dist/index').default;

const scopes = [
    "GET:ws.ufficiopostale.com/raccomandate",
    "GET:imprese.altravia.com/autocomplete",
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
    'pa.openapi.it',
];

test('init', async function() {

    let client = await Openapi.init('test', process.env.OPENAPI_USERNAME, process.env.API_KEY);
    const token = await client.generateToken(scopes);
    expect(typeof token === 'string').toBeTruthy()
})

test('initWithString', async function() {
    let client = await Openapi.init('production', process.env.OPENAPI_USERNAME, process.env.API_KEY);
    const token = await client.generateToken('imprese.altravia.com');
    expect(typeof token === 'string').toBeTruthy()
})

test('initWithToken', async function() {
    let client = await Openapi.init('test', process.env.OPENAPI_USERNAME, process.env.API_KEY, process.env.TOKEN);
    expect(client.comuni).toBeDefined();
})

test('initWithOldToken', async function() {

    let client = new Openapi('test', process.env.OPENAPI_USERNAME, process.env.API_KEY);

    const token = process.env.OLD_TOKEN;
    expect(typeof token === 'string').toBe(true);

    expect(client.comuni).toBeDefined()
})

test('initWithSkip', async function() {

    let client = new Openapi('test', process.env.OPENAPI_USERNAME, process.env.API_KEY);

    const token = process.env.TOKEN;
    expect(typeof token === 'string').toBe(true);

    expect(client.comuni).toBeDefined()
    expect(client.imprese).toBeDefined()

    const pec = await client.imprese.getPec('12485671007')
    expect(pec).toBeDefined();

    const codice = await client.comuni.getCitiesByCap('00121')
    expect(codice[0].regione).toBeDefined();
})

test('testComuni', async function() {
    const token = process.env.TOKEN;
    expect(typeof token === 'string').toBe(true);

    let client = await Openapi.init('test', process.env.OPENAPI_USERNAME, process.env.API_KEY, token);

    const cap = await client.comuni.getCitiesByCap('00121')
    expect(cap[0].regione).toBe('Lazio');

    const province = await client.comuni.listProvince();
    expect(province.MI).toBeDefined();

    const comuni = await client.comuni.listComuni('MI');
    expect(comuni[0]).toBeDefined();

    const istat = await client.comuni.getFromIstatCode('055032');
    expect(istat).toBeDefined();
})

test('testImprese', async function() {
    let client = await Openapi.init('production', process.env.OPENAPI_USERNAME, process.env.API_KEY, process.env.TOKEN);

    const piva = await client.imprese.getByPartitaIva('12485671007')
    expect(piva).toBeDefined();

    const pivaAvd = await client.imprese.getAdvancedByPartitaIva('12485671007')
    expect(pivaAvd).toBeDefined();

    const pec = await client.imprese.getPec('12485671007')
    expect(pec).toBeDefined();

    const imprese = await client.imprese.search({ provincia: 'RM' })
    expect(imprese).toBeDefined();

    const auto = await client.imprese.autocomplete('pizzeria')
    expect(auto).toBeDefined()

    const fg = await client.imprese.listFormeGiuridiche()
    expect(fg).toBeDefined()
})

test('testPa', async function() {
    let client = await Openapi.init('test', process.env.OPENAPI_USERNAME, process.env.API_KEY, process.env.TOKEN);
    client.generateToken(scopes)
    const piva = await client.pa.findPa('00559720982')
    expect(piva).toBeDefined();
})

test('testFD', async function() {
    let client = await Openapi.init('test', process.env.OPENAPI_USERNAME, process.env.API_KEY, process.env.TOKEN);

    const listaFirmaElettroniche = await client.firmaDigitale.listFirmaElettronica();
    expect(listaFirmaElettroniche).toBeDefined();

    const pdf = await fs.promises.readFile(__dirname + '/resources/attachment.pdf')
    const newFirmaElettronica = await client.firmaDigitale.createFirmaElettronica('test.pdf', pdf.toString('base64'), [
        {
            'firstname': 'test',
            'lastname': 'test',
            'email': 'test@altravia.com',
            'phone': '+39321321321',
        }
    ]).catch(() => {})

    expect(newFirmaElettronica).toBeDefined();
})

test('testMT', async function() {
    let client = await Openapi.init('test', process.env.OPENAPI_USERNAME, process.env.API_KEY, process.env.TOKEN);
    const lotto = await client.marcheTemporali.checkLotto('FAKETSA.altravia16', 'FAKE9R155S9VF');
    expect(lotto.used).toBeDefined()
})

test('testValutometro', async function() {
    let client = await Openapi.init('test', process.env.OPENAPI_USERNAME, process.env.API_KEY, process.env.TOKEN);
    const p = await client.valutometro.listPropertyTypes()
    expect(p[0]).toBeDefined()

    const c = await client.valutometro.listContractTypes()
    expect(c[0]).toBeDefined()

    const q = await client.valutometro.quote('via del rivo 10 Terni', '20', 'sale')
    expect(q).toBeDefined()
})

test('testVisengine', async function() {
    let client = await Openapi.init('test', process.env.OPENAPI_USERNAME, process.env.API_KEY, process.env.TOKEN);
    const s = await client.visengine.listServices()
    expect(s[0]).toBeDefined()

    const visuraDescription = await client.visengine.getServiceDescription(s[0].hash_visura)
    expect(visuraDescription).toBeDefined();

    const json_visura = {'$0': 'test', '$1': 'lorem ipsum'}
    const callback = {
        url: 'enpoint.example.com',
        method: 'POST',
        field: 'data',
    }
    const visura = await client.visengine.createRequest(s[0].hash_visura, json_visura, {}, callback, null, 'close', true);
    expect(visura).toBeDefined();
})

test('testsms', async function() {
    let client = await Openapi.init('test', process.env.OPENAPI_USERNAME, process.env.API_KEY, process.env.TOKEN);
    const sms = await client.sms.send('test', 'Test sms', ['+39-3939989741'], 0, {}, true)
    expect(sms).toBeDefined()
})

test('testUP', async function() {
    let client = await Openapi.init('test', process.env.OPENAPI_USERNAME, process.env.API_KEY, process.env.TOKEN);
    expect(client.ufficioPostale).toBeDefined()
})

test('testUPlol', async function() {
    let client = await Openapi.init('test', process.env.OPENAPI_USERNAME, process.env.API_KEY);
    await client.generateToken('ws.ufficiopostale.com');
    const list = await client.ufficioPostale.listOrdinarie();
    expect(list).toBeDefined();
})