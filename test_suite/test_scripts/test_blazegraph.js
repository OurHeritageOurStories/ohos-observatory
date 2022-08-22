const pactum = require('pactum');

before(()=>{
    pactum.request.setDefaultTimeout(210000)
})

it('should check Blazegraph is up', async()=>{
    await pactum.spec()
        .get('http://localhost:8000/graph?hello/')
        .expectStatus(200)
});

/**
 * CREATE
 */

it('should insert fake facebook', async()=>{
    await pactum.spec()
        .post('http://localhost:8000/graph?')
        .withHeaders('Content-Type', 'text/plain')
        .withBody('<http://www.example.com/kev> <http://www.example.com/knows> <http://www.example.com/will> . ')
        .expectStatus(200)
        .expectBodyContains(
            '<data modified="1"'
        );
})

it('should insert invalid fake facebook', async()=>{
    await pactum.spec()
        .post('http://localhost:8000/graph?')
        .withHeaders('Content-Type', 'text/plain')
        .withBody('<http://www.example.com/"?> <http://www.example.com/> <http://www.example.com///...> . ')
        .expectStatus(200)
        .expectBodyContains(
            '<data modified="1"'
        );
})

it('should reject insert invalid fake facebook', async()=>{
    await pactum.spec()
        .post('http://localhost:8000/graph?')
        .withHeaders('Content-Type', 'text/plain')
        .withBody('<http://www.example.com/"?> <http://www.example.com/> <http://www.example.com/<http://www.example.com/"?> <http://www.example.com/>> . ')
        .expectStatus(500)
})


it('should reject insertion of incomplete fake facebook', async()=>{
    await pactum.spec()
        .post('http://localhost:8000/graph?')
        .withHeaders('Content-Type', 'text/plain')
        .withBody('<http://www.example.com/knows> <http://www.example.com/will> . ')
        .expectStatus(500)
})

it('should reject inserting with the wrong headers', async()=>{
    await pactum.spec()
    .post('http://localhost:8000/graph?')
    .withHeaders('Content-Type', 'application/trix')
    .withBody('<http://www.example.com/kev> <http://www.example.com/knows> <http://www.example.com/will> . ')
    .expectStatus(500)
})

it('should add a nested triple', async()=>{
    await pactum.spec()
        .post('http://localhost:8000/graph?')
        .withHeaders('Content-Type', 'application/x-n-triples-RDR')
        .withBody('<http://www.example.com/bobby> <http://www.example.com/dislikes> <http://www.example.com/timmy> . \n<< <http://www.example.com/bobby> <http://www.example.com/dislikes> <http://www.example.com/timmy> >> <http://www.example.com/says> <http://www.example.com/jane> .')
        .expectStatus(200)
        .expectBodyContains(
            '<data modified="3"'
        );
})

it('should reject addition of incomplete a nested triple', async()=>{
    await pactum.spec()
        .post('http://localhost:8000/graph?')
        .withHeaders('Content-Type', 'application/x-n-triples-RDR')
        .withBody('<http://www.example.com/bobby> <http://www.example.com/dislikes> <http://www.example.com/timmy> . \n<< <http://www.example.com/bobby> <http://www.example.com/dislikes> <http://www.example.com/timmy> >> <http://www.example.com/says> .')
        .expectStatus(500)
        
})

it('should reject inserting a nested triple with the wrong headers', async()=>{

    await pactum.spec()
        .post('http://localhost:8000/graph?')
        .withHeaders('Content-Type', 'application/trix')
        .withBody('<http://www.example.com/bobby> <http://www.example.com/dislikes> <http://www.example.com/timmy> . \n<< <http://www.example.com/bobby> <http://www.example.com/dislikes> <http://www.example.com/timmy> >> <http://www.example.com/says> <http://www.example.com/jane> .')
        .expectStatus(500);
})

it('should safely deal with inserting Cuneiform Unicode characters', async()=>{
  await pactum.spec()
  .post('http://localhost:8000/graph?')
  .withHeaders('Content-Type', 'text/plain')
  .withBody('<http://www.example.com/𒀀> <http://www.example.com/𒀌𒀚> <http://www.example.com/𒀰> . ')
  .expectStatus(200)
})

it('should safely deal with inserting U+168x Ogham Unicode characters', async()=>{
  await pactum.spec()
  .post('http://localhost:8000/graph?')
  .withHeaders('Content-Type', 'text/plain')
  .withBody('<http://www.example.com/ᚅ> <http://www.example.com/ᚉ> <http://www.example.com/ᚏ> . ')
  .expectStatus(200)
})

it('should safely deal with inserting U+169x Ogham Unicode characters', async()=>{
  await pactum.spec()
  .post('http://localhost:8000/graph?')
  .withHeaders('Content-Type', 'text/plain')
  .withBody('<http://www.example.com/ᚑ> <http://www.example.com/ᚕ> <http://www.example.com/᚛> . ')
  .expectStatus(200)
})

it('should safely deal with inserting flag emojis', async()=>{
  await pactum.spec()
  .post('http://localhost:8000/graph?')
  .withHeaders('Content-Type', 'text/plain')
  .withBody('<http://www.example.com/🇧🇮> <http://www.example.com/🇧🇶ᚕ> <http://www.example.com/🇫🇮> . ')
  .expectStatus(200)
})

it('should safely deal with blanks', async()=>{
  await pactum.spec()
  .post('http://localhost:8000/graph?')
  .withHeaders('Content-Type', 'text/plain')
  .withBody('<http://www.example.com/kev> <http://www.example.com/knows> <http://www.example.com/> . ')
  .expectStatus(200)
})

it('should safely deal with blank IRIs', async()=>{
  await pactum.spec()
  .post('http://localhost:8000/graph?')
  .withHeaders('Content-Type', 'text/plain')
  .withBody('<http://www.example.com/kev> <http://www.example.com/knows> <http://example.com/.well-known/genid/d26a2d0e98334696f4ad70a677abc1f6> . ')
  .expectStatus(200)
})

/**
 * READ
 */

it('should check that the standard triple of fake facebook has been inserted correctly', async()=>{
    await pactum.spec()
        .get('http://localhost:8000/graph?query=SELECT * { ?s ?p ?o } LIMIT 100')
        .withHeaders('Accept', 'application/json')
        .expectStatus(200)
        .expectJsonLike(
            {
                "results": {
                    "bindings": [
                        {
                            "s": {
                            "type": "uri",
                            "value": "http://www.example.com/kev"
                            },
                            "p": {
                            "type": "uri",
                            "value": "http://www.example.com/knows"
                            },
                            "o": {
                            "type": "uri",
                            "value": "http://www.example.com/will"
                            }
                        }
                    ]
                }
            }
        )
});

it('should check that the fake facebook nested triple has been inserted', async()=>{
    await pactum.spec()
        .get('http://localhost:8000/graph?query=SELECT * { ?s ?p ?o } LIMIT 100')
        .withHeaders('Accept', 'application/json')
        .expectStatus(200)
        .expectJsonLike(
            {
                "results": {
                    "bindings": [
                        {
                            "s": {
                                "type": "sid",
                                "subject": {
                                  "type": "uri",
                                  "value": "http://www.example.com/bobby"
                                },
                                "predicate": {
                                  "type": "uri",
                                  "value": "http://www.example.com/dislikes"
                                },
                                "object": {
                                  "type": "uri",
                                  "value": "http://www.example.com/timmy"
                                }
                              },
                              "p": {
                                "type": "uri",
                                "value": "http://www.example.com/says"
                              },
                              "o": {
                                "type": "uri",
                                "value": "http://www.example.com/jane"
                              }
                        }
                    ]
                }
            }
        )
})

/**
 * CREATE EXTRA 
 */

it('should add more fake facebook', async()=>{
    await pactum.spec()
    .post('http://localhost:8000/graph?')
    .withHeaders('Content-Type', 'text/plain')
    .withBody('<http://www.example.com/jonik> <http://www.example.com/knows> <http://www.example.com/bob> . ')
    .expectStatus(200)
    .expectBodyContains(
        '<data modified="1"'
    );
})

/**
 * READ SOME MORE
 */

it('should check that aditional bits fake facebook have been inserted correctly', async()=>{
    await pactum.spec()
        .get('http://localhost:8000/graph?query=SELECT * { ?s ?p ?o } LIMIT 100')
        .withHeaders('Accept', 'application/json')
        .expectStatus(200)
        .expectJsonLike(
            {
                "results": {
                    "bindings": [
                        {
                            "s": {
                            "type": "uri",
                            "value": "http://www.example.com/jonik"
                            },
                            "p": {
                            "type": "uri",
                            "value": "http://www.example.com/knows"
                            },
                            "o": {
                            "type": "uri",
                            "value": "http://www.example.com/bob"
                            }
                        }
                    ]
                }
            }
        )
})

/**
 * DISTROY
 */

it('should remove Jonik the test database', async()=>{
    await pactum.spec()
        .delete('http://localhost:8000/graph?s=<http://www.example.com/jonik>')
        .expectStatus(200)
        .expectBodyContains(
            '<data modified="'
        )
})

/**
 * RE-READ TO CHECK DISTROY
 */

it('should find a set of results without Jonik', async()=>{
    await pactum.spec()
        .get('http://localhost:8000/graph?query=SELECT * { ?s ?p ?o } LIMIT 100')
        .withHeaders('Accept', 'application/json')
        .expectStatus(200)
        .expectJsonLike(
            {
                "head": {
                  "vars": [
                    "s",
                    "p",
                    "o"
                  ]
                },
                "results": {
                  "bindings": [
                    {
                      "s": {
                        "type": "sid",
                        "subject": {
                          "type": "uri",
                          "value": "http://www.example.com/bobby"
                        },
                        "predicate": {
                          "type": "uri",
                          "value": "http://www.example.com/dislikes"
                        },
                        "object": {
                          "type": "uri",
                          "value": "http://www.example.com/timmy"
                        }
                      },
                      "p": {
                        "type": "uri",
                        "value": "http://www.example.com/says"
                      },
                      "o": {
                        "type": "uri",
                        "value": "http://www.example.com/jane"
                      }
                    },
                    {
                      "s": {
                        "type": "uri",
                        "value": "http://www.example.com/bobby"
                      },
                      "p": {
                        "type": "uri",
                        "value": "http://www.example.com/dislikes"
                      },
                      "o": {
                        "type": "uri",
                        "value": "http://www.example.com/timmy"
                      }
                    },
                    {
                      "s": {
                        "type": "uri",
                        "value": "http://www.example.com/kev"
                      },
                      "p": {
                        "type": "uri",
                        "value": "http://www.example.com/knows"
                      },
                      "o": {
                        "type": "uri",
                        "value": "http://www.example.com/will"
                      }
                    }
                  ]
                }
              }
        )
})

/**
 * Finally, distroy everything
 */

it('should get rid of everything', async()=>{
    await pactum.spec()
        .delete('http://localhost:8000/graph?DROP ALL')
        .expectStatus(200)
        .expectBodyContains(
            '<data modified="'
        )
})

/**
 * And check that its all gone
 */

it('should find an empty database', async()=>{
    await pactum.spec()
        .get('http://localhost:8000/graph?query=SELECT * {?s ?p ?o} LIMIT 100')
        .withHeaders('Accept', 'application/json')
        .expectStatus(200)
        .expectJsonLike(
            {
                "head": {
                    "vars": [
                        "s",
                        "p",
                        "o"
                    ]
                },
                "results": {
                    "bindings": [
                    ]
                }
            }
        )
})
