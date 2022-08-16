import requests
import json

url = "https://dbpedia.org/sparql/"
headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
body = "query=SELECT ?t WHERE{<http://dbpedia.org/resource/HMS_Victory> <http://dbpedia.org/ontology/thumbnail> ?t .}\n&format=application%2Fsparql-results%2Bjson"
res = requests.post(url, headers=headers, data=body)
print(str(res.text))
