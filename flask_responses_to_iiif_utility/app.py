from time import sleep
from urllib import response
from flask import Flask
import asyncio
import json
import PIL
from PIL import Image, ExifTags
import requests
import io
import urllib.request


app = Flask(__name__)

async def dbpedia_get_thumbnail(ref):
    url = "https://dbpedia.org/sparql?default-graph-uri=http%3A%2F%2Fdbpedia.org&query=SELECT+%3Fi+WHERE+%7B%0D%0A+++%7B%3Chttp%3A%2F%2Fdbpedia.org%2Fresource%2F" + ref + "%3E+%3Chttp%3A%2F%2Fdbpedia.org%2Fontology%2Fthumbnail%3E+%3Fi%7D%0D%0A%7D&format=application%2Fsparql-results%2Bjson&timeout=30000&signal_void=on&signal_unconnected=on"
    response = requests.get(url)
    if (len(response.json()["results"]["bindings"])!=0):
        return response.json()["results"]["bindings"][0]["i"]["value"]
    else:
        raise "error getting thumbnail url"

async def get_image_resolution(url):
    urllib.request.urlretrieve(url, "test")
    image = Image.open("test")
    width, height = image.size
    return [width, height]

async def get_distinct_objects():
    url = 'http://ohos_observatory_kong:8000/graph?query=SELECT DISTINCT ?s where {?s ?p <http://dbpedia.org/resource/Organization> } LIMIT 4'
    header = {"Accept":"application/json"}
    response = requests.get(url, headers=header)
    toreturn = []
    for item in response.json()["results"]["bindings"]:
        toreturn.append(item["s"]["value"])
    return toreturn

async def construct_json():
    built_json = {}
    built_json["@context"] = "http://iiif.io/api/presentation/3/context.json"
    built_json["@id"] = "Test manifest"
    built_json["type"] = "Manifest"
    built_json["items"] = []
    objects = await get_distinct_objects()
    for item in objects:
        fragment = {}
        fragment["id"] = item
        fragment["type"] = "canvas"
        url_thumbnail = await dbpedia_get_thumbnail(item.split("/")[len(item.split("/"))-1])
        thumbnail_metadata = await get_image_resolution(url_thumbnail)
        fragment["height"] = thumbnail_metadata[1]
        fragment["width"] = thumbnail_metadata[0]
        fragment["items"] = []
        inner_fragment = {}
        inner_fragment["id"] = item
        inner_fragment["type"] = "AnnotationPage"
        inner_fragment["items"] = []
        inner_fragment_2 = {}
        inner_fragment_2["id"] = item
        inner_fragment_2["type"] = "Annotation"
        inner_fragment_2["motivation"] = "Painting"
        inner_fragment_2["body"] = {}
        inner_fragment_2["body"]["id"] = item
        inner_fragment_2["body"]["type"] = "image"
        inner_fragment_2["body"]["format"] = "image/jpg"
        inner_fragment_2["body"]["height"] = thumbnail_metadata[1]
        inner_fragment_2["body"]["width"] = thumbnail_metadata[0]
        inner_fragment_2["target"] = item
        inner_fragment["items"].append(inner_fragment_2)
        fragment["items"].append(inner_fragment)
        built_json["items"].append(fragment)
    return built_json

@app.route("/")
async def home():#https://testdriven.io/blog/flask-async/
    iiif_manifest = await construct_json()
    return json.dumps(iiif_manifest, indent=4)