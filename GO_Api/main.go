package main

import (
	"io/ioutil"

	"log"

	"net/http"

	"net/url"

	"github.com/gin-gonic/gin"

	"bytes"

	"encoding/json"

	"fmt"

	"strings"
)

type rdf_triple struct {
	Subject   string `json:"subject"`
	Predicate string `json:"predicate"`
	Object    string `json:"object"`
}

func (rdf rdf_triple) String() string {
	return fmt.Sprintf("%rdf", rdf)
}

type rdf_graph struct { //this serves as the initial basic cache
	Id    string       `json:"id"`
	Graph []rdf_triple `json:"graph"`
}

var rdf_triples_example = []rdf_triple{
	{Subject: "dave", Predicate: "knows", Object: "tim"},
	{Subject: "tim", Predicate: "knows", Object: "dave"},
}

var rdf_graph_example = []rdf_graph{
	{Id: "test",
		Graph: []rdf_triple{
			rdf_triple{
				Subject:   "bill",
				Predicate: "and",
				Object:    "ben",
			},
			rdf_triple{
				Subject:   "dick",
				Predicate: "and",
				Object:    "dom",
			},
		},
	},
	{Id: "test2",
		Graph: []rdf_triple{
			rdf_triple{
				Subject:   "2bill",
				Predicate: "an2d",
				Object:    "ben2",
			},
			rdf_triple{
				Subject:   "2dick",
				Predicate: "a2nd",
				Object:    "do2m",
			},
		},
	},
}

func main() {
	router := gin.Default()

	router.GET("/graph/hello", getExampleWebData)

	router.GET("/graph", queryGraphFromCache)
	router.POST("/graph/post", postToGraphFromKongAPI)
	router.DELETE("/graph/delete", deleteFromGraphFromKongAPI)

	//router.GET("/graph/federated?:query", federatedQuery)

	router.GET("/annotation/hello", getExampleWebData)

	//router.GET("/annotation:query", getAnnotationFromCache)
	//router.POST("/annotation:query", postAnnotationToKongAPI)
	//router.PUT("/annotation:query", putAnnotationToKongAPI)
	//router.DELETE("/annotation:query", deleteAnnotationFromKongAPI)

	router.GET("/manifest/:query", getManifestFromCache)

	router.Run(":9090")
}

func getExampleWebData(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, rdf_graph_example)
}

//
//Below are the go direct to cache routes
//

func queryGraphFromCache(c *gin.Context) {
	query := c.Query("query")
	//if checkCacheContents(query) {
	//c.IndentedJSON(http.StatusOK, graph_cache)
	//} else {
	getGraphFromKongAPI(c, query)
	//}
}

//func getAnnotationFromCache(c *gin.Context) { //annotation server currently unused in front end, thus commented out
//	query := c.Query("query")
//if checkCacheContents(query) {
//	c.IndentedJSON(http.StatusOK, graph_cache)
//} else {
//	getAnnotationFromKongAPI(query, method)
//}
//}

func getManifestFromCache(c *gin.Context) { // currently, it doesn't accept a query
	//query := c.Query("query")
	//if checkCacheContents(query) {
	//	c.IndentedJSON(http.StatusOK, graph_cache)
	//} else {
	getManifestFromKongAPI(c) //, query)
	//}
}

//
//Below are the slower, go via Kong routes
//

func getGraphFromKongAPI(c *gin.Context, search_query string) {
	query := search_query
	if len(query) == 0 {
		query = c.Query("query")
	}
	escapedQuery := url.QueryEscape(query)
	resp, err := http.Get("http://ohos_observatory_kong:8000/graph?" + strings.ReplaceAll(escapedQuery, "+", "%20"))
	if err != nil {
		log.Fatalln(err)
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	stringBody := string(body)
	c.IndentedJSON(http.StatusOK, stringBody)
}

func postToGraphFromKongAPI(c *gin.Context) {
	postBody, _ := json.Marshal(map[string]string{ //TODO this is just a sample
		"Subject":   "test",
		"Predicate": "triple",
		"Object":    "insertion",
	})
	responseBody := bytes.NewBuffer(postBody)
	resp, err := http.Post("http://ohos_observatory_kong:8000/graph-full-access?", "application/json", responseBody)
	if err != nil {
		log.Fatalf("An error occured %v", err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	stringBody := string(body)
	c.IndentedJSON(http.StatusOK, stringBody)
}

func deleteFromGraphFromKongAPI(c *gin.Context, search_query string) {
	query := search_query
	if len(query) == 0 {
		query = c.Query("query")
	}
	escapedQuery := url.QueryEscape(query)
	client := &http.Client{}                                                                                                                                 //I think its this that Gin doesn't like
	req, err := http.NewRequest(http.MethodDelete, "http://ohos_observatory_kong:8000/graph-full-access?"+strings.ReplaceAll(escapedQuery, "+", "%20"), nil) //https://groups.google.com/g/golang-nuts/c/-wAwU8av2oo
	if err != nil {
		log.Fatalln(err)
	}
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()
	respBody, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	c.IndentedJSON(http.StatusOK, respBody)
}

//
//We aren't doing anything with the Annotation server yet
//

//func getAnnotationFromKongAPI(c *gin.Context) {
//	query := c.Query("query")
//}

//func postAnnotationToKongAPI(c *gin.Context) {
//	query := c.Query("query")
//}

//func putAnnotationToKongAPI(c *gin.Context) {
//	query := c.Query("query")
//}

//func deleteAnnotationFromKongAPI(c *gin.Context) {
//	query := c.Query("query")
//}

//
//We are, however, using the manifest
//

func getManifestFromKongAPI(c *gin.Context) { //currently the functionality of the manifest getter is limted. You ask it for one, it'll give you something small based on the dataset that you then work with
	resp, err := http.Get("http://ohos_observatory_kong:8000/manifest/")
	if err != nil {
		log.Fatalln(err)
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	stringBody := string(body)
	c.IndentedJSON(http.StatusOK, stringBody)
}
