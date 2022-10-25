const pactum = require('pactum');

before(()=>{
    pactum.request.setDefaultTimeout(210000)
})

it('should get a response from Flask', async()=>{
    await pactum.spec()
        .get('http://localhost:8000/manifest/')
        .expectStatus(200)
        .expectBodyContains(
            '"@context": "http://iiif.io/api/presentation/3/context.json"'
        )
}).timeout(1000000)