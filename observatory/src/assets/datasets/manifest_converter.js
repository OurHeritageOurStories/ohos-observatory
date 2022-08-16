//from xml.etree.ElementTree import tostring
//import requests
//import json
//
//url = "https://dbpedia.org/sparql/"
//headers = {
//            "Content-Type": "application/x-www-form-urlencoded"
//       }
//body = "query=SELECT ?t WHERE{<http://dbpedia.org/resource/HMS_Victory> <http://dbpedia.org/ontology/thumbnail> ?t .}\n&format=application/sparql-results+json"
//res = requests.post(url, headers=headers, data=body)
//#res = requests.post(url, data=body)
//#res_json = res.json()
//print(str(res.content))


//import fetch from 'node-fetch'
//globalThis.fetch = fetch

function get_dbpedia_thumbnail(){
    var result;
    fetch("https://dbpedia.org/sparql/", {
        body: "query=SELECT ?t WHERE{<http://dbpedia.org/resource/HMS_Victory> <http://dbpedia.org/ontology/thumbnail> ?t .}\n&format=application%2Fsparql-results%2Bjson",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
        })
            .then(response=>response.json())
            .then(response=>console.log(response))
}

get_dbpedia_thumbnail()