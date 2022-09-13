package main

import (
	"io/ioutil"

	"log"

	"net/http"

	"github.com/gin-gonic/gin"
)

type rdf_triple struct {
	Subject   string `json:"subject"`
	Predicate string `json:"predicate"`
	Object    string `json:"object"`
}

var rdf_graph_example = []rdf_triple{
	{Subject: "dave", Predicate: "knows", Object: "tim"},
	{Subject: "tim", Predicate: "knows", Object: "dave"},
}

type graph_cache_struct struct {
	Key   string       `json:"Key"`
	Graph []rdf_triple `json:"Graph"`
}

var graph_cache = []graph_cache_struct{
	{Key: "test", Graph: rdf_graph_example},
}

func main() {
	router := gin.Default()

	router.GET("/graph/hello", getExampleWebData)

	router.GET("/graph?:query", queryGraphFromCache)
	router.POST("/graph?:query", postToGraphFromKongAPI)
	router.DELETE("/graph?:query", deleteFromGraphFromKongAPI)

	//router.GET("/graph/federated?:query", federatedQuery)

	router.GET("/annotation/hello", getExampleWebData)

	//router.GET("/annotation:query", getAnnotationFromCache)
	//router.POST("/annotation:query", postAnnotationToKongAPI)
	//router.PUT("/annotation:query", putAnnotationToKongAPI)
	//router.DELETE("/annotation:query", deleteAnnotationFromKongAPI)

	router.GET("/manifest:query", getManifestFromCache)

	router.Run("localhost:9090")
}

func getExampleWebData(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, rdf_graph_example)
}

//
//Below are the go direct to cache routes
//

func queryGraphFromCache(c *gin.Context) {
	query := c.Param("query")
	if checkCacheContents(query) {
		c.IndentedJSON(http.StatusOK, graph_cache)
	} else {
		method = c.Request.Method
		getGraphFromKongAPI(query, method)
	}
}

func getAnnotationFromCache() {
	query := c.Param("query")
	if checkCacheContents(query) {
		c.IndentedJSON(http.StatusOK, graph_cache)
	} else {
		method = c.Request.Method
		getAnnotationFromKongAPI(query, method)
	}
}

func getManifestFromCache() {
	query := c.Param("query")
	if checkCacheContents(query) {
		c.IndentedJSON(http.StatusOK, graph_cache)
	} else {
		method = c.Request.Method
		getManifestFromKongAPI(query, method)
	}
}

//
//Below is the "add to cache" method
//

func addToCache(key, value) {

}

//
//Below are the slower, go via Kong routes
//

func getGraphFromKongAPI(query) {
	if query == nil {
		query := c.Param("query")
	}
	resp, err := http.GET("http://ohos_observatory_kong:8000/graph?" + query)
	if err != nil {
		log.Fatalln(err)
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	stringBody := string(body)
	addToCache(query, stringBody)
	c.IndentedJSON(http.StatusOK, stringBody)
}

func postToGraphFromKongAPI(query) {
	if query == nil {
		query := c.Param("query")
	}
	postBody, _ := json.Marshal(map[string]string{ //TODO this is just a sample
		"Subject":   "test",
		"Predicate": "triple",
		"Object":    "insertion",
	})
	responseBody := bytes.NewBuffer(postBody)
	resp, err := http.POST("http://ohos_observatory_kong:8000/graph?", "application/json", responseBody)
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

func deleteFromGraphFromKongAPI(query) {
	if query == nil {
		query := c.Param("query")
	}
	resp, err := http.DELETE("http://ohos_observatory_kong:8000/graph?" + query)
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

func getAnnotationFromKongAPI() {
	query := c.Param("query")
}

func postAnnotationToKongAPI() {
	query := c.Param("query")
}

func putAnnotationToKongAPI() {
	query := c.Param("query")
}

func deleteAnnotationFromKongAPI() {
	query := c.Param("query")
}

//
//We are, however, using the manifest
//

func getManifestFromKongAPI() {
	if query == nil {
		query := c.Param("query")
	}
	resp, err := http.GET("http://ohos_observatory_kong:8000/manifest/")
	if err != nil {
		log.Fatalln(err)
	}
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}
	stringBody := string(body)
	addToCache(query, stringBody)
	c.IndentedJSON(http.StatusOK, stringBody)
}

func checkCacheContents(String query) {
	//TODO this may be non-needed
	//TODO implement this running on a seperate thread to check if it'll end up increasing the speed
	return false
}

func federatedQuery() {

}
