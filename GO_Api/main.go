package main

import (
	"io/ioutil"

	"log"

	"net/http"

	"github.com/gin-gonic/gin"

	"bytes"

	"encoding/json"

	"fmt"
)

type rdf_triple struct {
	Subject   string `json:"subject"`
	Predicate string `json:"predicate"`
	Object    string `json:"object"`
}

func (rdf rdf_triple) String() string {
	return fmt.Sprintf("%rdf", rdf)
}

//type rdf_graph struct {
////Triple rdf_triple `json:"Triple"`
//Triple rdf_triple
////rdf_triple interface{}
//}

type rdf_graph struct { //this serves as the initial basic cache
	Id    string       `json:"id"`
	Graph []rdf_triple `json:"graph"`
	//Graph string `json:"graph"`
}

var rdf_triples_example = []rdf_triple{
	{Subject: "dave", Predicate: "knows", Object: "tim"},
	{Subject: "tim", Predicate: "knows", Object: "dave"},
}

//var rdf_graph_example = []rdf_graph{
//	Triple{Subject: "dave", Predicate: "knows", Object: "tim"},
//	//rdf_triple{Subject: "dave", Predicate: "knows", Object: "tim"},
//	//{Subject: "tim", Predicate: "knows", Object: "dave"}
//}

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

//type graph_cache_struct struct {
//	Key string `json:"Key"`
//	//Graph []rdf_triple `json:"Graph"`
//	Graph rdf_graph `json:"Graph"`
//}

//var graph_cache = []graph_cache_struct{
//	{Key: "test", Graph: rdf_graph_example},
//}

func main() {
	router := gin.Default()

	router.GET("/graph/hello", getExampleWebData)

	router.GET("/graph/:query", queryGraphFromCache)
	router.POST("/graph/:query", postToGraphFromKongAPI)
	router.DELETE("/graph/:query", deleteFromGraphFromKongAPI)

	//router.GET("/graph/federated?:query", federatedQuery)

	router.GET("/annotation/hello", getExampleWebData)

	//router.GET("/annotation:query", getAnnotationFromCache)
	//router.POST("/annotation:query", postAnnotationToKongAPI)
	//router.PUT("/annotation:query", putAnnotationToKongAPI)
	//router.DELETE("/annotation:query", deleteAnnotationFromKongAPI)

	router.GET("/manifest/:query", getManifestFromCache)

	router.Run(":9090")

	//router.Run()

	//httpPort := "9090"
}

func getExampleWebData(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, rdf_graph_example)
	//c.IndentedJSON(http.StatusOK, "dlja")
	//c.IndentedJSON(http.StatusOK, reflect.TypeOf(rdf_graph_example))
	//c.IndentedJSON(http.StatusOK, fmt.Println(rdf_graph_example))
	//c.In(http.StatusOK, rdf_graph_example)
	//c.GetString()
	//c.JSON(http.StatusOK, rdf_graph_example)
	//c.IndentedJSON(http.StatusOK, rdf_triples_example)
}

//
//Below are the go direct to cache routes
//

func queryGraphFromCache(c *gin.Context) {
	query := c.Param("query")
	//if checkCacheContents(query) {
	//c.IndentedJSON(http.StatusOK, graph_cache)
	//} else {
	getGraphFromKongAPI(c, query)
	//}
}

//func getAnnotationFromCache(c *gin.Context) {
//	query := c.Param("query")
//	method := ""
//if checkCacheContents(query) {
//	c.IndentedJSON(http.StatusOK, graph_cache)
//} else {
//	method = c.Request.Method
//	getAnnotationFromKongAPI(query, method)
//}
//}

func getManifestFromCache(c *gin.Context) {
	//query := c.Param("query")
	//if checkCacheContents(query) {
	//	c.IndentedJSON(http.StatusOK, graph_cache)
	//} else {
	getManifestFromKongAPI(c) //, query)currently, it doesn't accept a query
	//}
}

//
//Below are the slower, go via Kong routes
//

func getGraphFromKongAPI(c *gin.Context, search_query string) {
	query := search_query
	if len(query) == 0 {
		query = c.Param("query")
	}
	resp, err := http.Get("http://ohos_observatory_kong:8000/graph?" + query)
	if err != nil {
		log.Fatalln(err)
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	stringBody := string(body)
	//stringBody = rdf_triple{stringBody}
	//cache_addition := graph_cache_struct{Key: query, Graph: stringBody}
	//graph_cache = append(graph_cache, cache_addition)
	c.IndentedJSON(http.StatusOK, stringBody)
}

func postToGraphFromKongAPI(c *gin.Context) {
	postBody, _ := json.Marshal(map[string]string{ //TODO this is just a sample
		"Subject":   "test",
		"Predicate": "triple",
		"Object":    "insertion",
	})
	responseBody := bytes.NewBuffer(postBody)
	resp, err := http.Post("http://ohos_observatory_kong:8000/graph?", "application/json", responseBody)
	if err != nil {
		log.Fatalf("An error occured %v", err)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	stringBody := string(body)
	log.Printf(stringBody)
	c.IndentedJSON(http.StatusOK, stringBody)
}

func deleteFromGraphFromKongAPI(c *gin.Context) {
	query := c.Param("query")
	//	resp, err := http.Delete("http://ohos_observatory_kong:8000/graph?" + query)
	resp, err := http.NewRequest("DELETE", "http://ohos_observatory_kong:8000/graph?"+query, nil) //https://groups.google.com/g/golang-nuts/c/-wAwU8av2oo
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

//
//We aren't doing anything with the Annotation server yet
//

//func getAnnotationFromKongAPI(c *gin.Context) {
//	query := c.Param("query")
//}

//func postAnnotationToKongAPI(c *gin.Context) {
//	query := c.Param("query")
//}

//func putAnnotationToKongAPI(c *gin.Context) {
//	query := c.Param("query")
//}

//func deleteAnnotationFromKongAPI(c *gin.Context) {
//	query := c.Param("query")
//}

//
//We are, however, using the manifest
//

func getManifestFromKongAPI(c *gin.Context) { //, query string) {
	//if query == nil {
	//	query := c.Param("query") Currently, it doesn't accept a query, its in testing
	//}
	resp, err := http.Get("http://ohos_observatory_kong:8000/manifest/")
	if err != nil {
		log.Fatalln(err)
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	stringBody := string(body)
	//addToCache(query, stringBody)
	c.IndentedJSON(http.StatusOK, stringBody)
}

//func checkCacheContents(query) {
//TODO this may be non-needed
//TODO implement this running on a seperate thread to check if it'll end up increasing the speed
//}

//func federatedQuery() {
//
//}
