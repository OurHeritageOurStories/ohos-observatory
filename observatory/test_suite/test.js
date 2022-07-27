/*const pactum = require('pactum');

it('google test', async() =>{
    await pactum.spec()
        .get('http://www.google.co.uk')
        .expectStatus(200)
});

it('should show blazegraph as 200', async() =>{
    await pactum.spec()
        .get('http://localhost:8000/blazegraph/home/')
        .expectStatus(200);
});

it('should insert fake facebook', async() =>{
    await pactum.spec()
        .post('http://localhost:8000/blazegraph/insert')
        .withHeaders('Content-Type', 'text/plain')
        .withBody('<http://www.example.com/alice> <http://www.example.com/knows> <http://www.example.com/jim> . ')
        .expectStatus(200);
});

//Miiify tests, as copied from John's tests

*/

const pactum = require('pactum');
/*
it('Tests Google to check for really obvious problems', async()=>{
    await pactum.spec()
        .get('http://www.google.co.uk')
        .expectStatus(200)
});
*/