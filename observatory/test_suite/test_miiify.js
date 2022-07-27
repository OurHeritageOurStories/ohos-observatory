const pactum = require('pactum');

before(()=>{
    pactum.request.setBaseUrl('http://localhost:8000/annotation')
})

it('should create a container', async()=>{
    await pactum.spec()
        .post('/')
        .withHeaders('Slug', 'test_container')
        .withHeaders('Content-Type', 'application/json')
        .withJson({
            "@context": [
              "http://www.w3.org/ns/anno.jsonld",
              "http://www.w3.org/ns/ldp.jsonld"
            ],
            "type": ["BasicContainer", "AnnotationCollection"],
            "label": "A Container for Web Annotations"
          })
        .expectStatus(201)
        .expectJsonSchemaAt(
            'type',
            {
                "type": "array",
                "items": {
                    "type": "string"
                }
            }
        )
        .expectJsonLike(
            {
                "type": [
                    "BasicContainer",
                    "AnnotationCollection"
                  ]
            }
        );
});

it('should get empty collection', async()=>{
    await pactum.spec()
        .get('/test_container/')
        .expectStatus(200)
        .expectJsonSchemaAt(
            'id',
            {
                "type": "string"
            },
            'type',
            {
                "type": "string"
            }
        )
        .expectJsonLike(
            {
                "total": 0
            }
        );
});

//add 199 annotations
for (i = 0; i < 199; i++){
    it('should add an annotation', async()=>{
        await pactum.spec()
            .post('/test_container/')
            .withJson(
                {
                    "@context": "http://www.w3.org/ns/anno.jsonld",
                    "type": "Annotation",
                    "body": "http://example.org/post1",
                    "target": "http://example.com/page1"
                  }
            )
            .expectStatus(201)
            .expectJsonSchemaAt(
                'type',
                {
                    "type": "string"
                }
            )
            .expectJsonLike(
                {
                    "type": "Annotation"
                }
            );
    });
};

it('should find 199 annotations', async()=>{
    await pactum.spec()
        .get('/test_container/')
        .expectStatus(200)
        .expectJsonSchemaAt(
            'type',
            {
                "type": "array",
                "items":
                {
                    "type": "string"
                }
            }
        )
        .expectJsonLike(
            {
                "total": 199,
                "type": [
                    "BasicContainer",
                    "AnnotationCollection"
                ]
            }
        );
});

it('should get annotation page', async()=>{
    await pactum.spec()
        .get('/test_container')
        .expectStatus(200)
        .expectJsonSchemaAt(
            'type',
            {
                "type": "string"
            }
        )
        .expectJsonLike(
            {
                "type": "AnnotationPage",
                "partOf":{
                    "total": 199
                },
                "items": '$V.length === 199'
            }
        );
});

it('should get the first annotation page', async()=>{
    await pactum.spec()
        .get('/test_container')
        .withQueryParams({
            'page': 0
        })
        .expectStatus(200)
        .expectJsonSchemaAt(
            'type',
            {
                "type": "string"
            }
        )
        .expectJsonLike(
            {
                "partOf": {
                    "total": 199
                },
                "type": "AnnotationPage",
                "items": '$V.length === 199'
            }
        );
});

it('should not get the second annotation page', async()=>{
    await pactum.spec()
        .get('/test_container')
        .withQueryParams({
            'page': 1
        })
        .expectStatus(404);
});

it('should add foobar annotation', async()=>{
    await pactum.spec()
        .post('/test_container/')
        .withHeaders({
            Slug: "foobar"
        })
        .withJson(
            {
                "@context": "http://www.w3.org/ns/anno.jsonld",
                "type": "Annotation",
                "body": "http://example.org/post1",
                "target": "http://example.com/page1"
              }
        )
        .expectStatus(201)
        .expectJsonSchemaAt(
            'type',
            {
                "type": "string"
            }
        )
        .expectJsonLike(
            {
                "type": "Annotation"
            }
        );
});

it('should get foobar anotation', async()=>{
    await pactum.spec()
        .get('/test_container/foobar')
        .expectStatus(200)
        .expectJsonSchemaAt(
            'type',
            {
                "type": "string"
            }
        )
        .expectJsonLike(
            {
                "type": "Annotation"
            }
        );
});

//todo this one in particular isn't a good test, it really needs the 'keys' bit from the main tests
it('should modify foobar anotation and check', async()=>{
    await pactum.spec()
        .put('/test_container/foobar')
        .withJson(
            {
                "@context": "http://www.w3.org/ns/anno.jsonld",
                "id": "https://localhost:8000/annotations/test_container/foobar",
                "type": "Annotation",
                "body": "http://example.org/post2",
                "target": "http://example.com/page2"
              }
        )
        .expectStatus(200)
        .expectJsonSchemaAt(
            'modified',
            {

            },
            'type',
            {
                "type": "string"
            }
        )
        .expectJsonLike(
            {
                type: 'Annotation'
            }
        )
});

it('should delete foobar annotation', async()=>{
    await pactum.spec()
        .delete('/test_container/foobar')
        .expectStatus(204)
});

it('should not get the second annotation page', async()=>{
    await pactum.spec()
        .get('/test_container')
        .withQueryParams({
            'page': 1
        })
        .expectStatus(404);
});

it('should check the container collection total', async()=>{
    await pactum.spec()
        .get('/test_container/')
        .expectStatus(200)
        .expectJsonSchemaAt(
            'type',
            {
                "type": "array",
                "items":
                {
                    "type": "string"
                }
            }
        )
        .expectJsonLike(
            {
                "total": 199,
                "type": [
                    "BasicContainer",
                    "AnnotationCollection"
                ]
            }
        )
});

it('should add 1 more annotation to the container', async()=>{
    await pactum.spec()
    .post('/test_container/')
    .withJson(
        {
            "@context": "http://www.w3.org/ns/anno.jsonld",
            "type": "Annotation",
            "body": "http://example.org/post1",
            "target": "http://example.com/page1"
          }
    )
    .expectStatus(201)
    .expectJsonSchemaAt(
        'type',
        {
            "type": "string"
        }
    )
    .expectJsonLike(
        {
            "type": "Annotation"
        }
    );
});

it('should check the container collection total and keys', async()=>{
    await pactum.spec()
        .get('/test_container/')
        .expectStatus(200)
        .expectJsonSchemaAt(
            'type',
            {
                "type": "array",
                "items":
                {
                    "type": "string"
                }
            },
            'first',
            'last'
        )
        .expectJsonLike(
            {
                "total": 200,
                "type": [
                    "BasicContainer",
                    "AnnotationCollection"
                ]
            }
        );
});

it('should check the first annotation page total and keys', async()=>{
    await pactum.spec()
        .get('/test_container')
        .expectStatus(200)
        .expectJsonSchemaAt(
            'type',
            {
                "type": "string"
            },
            'next'
        )
        .expectJsonLike(
            {
                "partOf":{
                    "total": 200
                },
                "type": "AnnotationPage",
                "items": '$V.length === 200'//breaking, for some odd reason
            }
        );
});

it('it should check the second page total and keys', async()=>{
    await pactum.spec()
        .get('/test_container')
        .withQueryParams({
            'page': 1
        })
        .expectStatus(200)
        .expectJsonSchemaAt(
            'type',
            {
                "type": "string"
            },
            'prev'
        )
        .expectJsonLike(
            {
                "partOf":{
                    "total": 200
                },
                "type": "AnnotationPage",
                "items": '$V.length === 0'
            }
        );
});

it('should delete a container', async()=>{
    await pactum.spec()
        .delete('/test_container/')
        .expectStatus(204)
});
