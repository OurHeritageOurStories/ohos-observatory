package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type rdf_triple struct {
	Subject string `json:"subject"`
	Predicate string `json:"predicate"`
	Object string `json:"object"`
}

var rdf_graph_example = []rdf_triple{
	{Subject: "dave", Predicate: "knows", Object: "tim"},
	{Subject: "tim", Predicate: "knows", Object: "dave"},
}

func main(){
	router := gin.Default()
	
	router.GET("/graph/hello", getExampleWebData)
	
	router.GET("/graph?:query", getExampleWebData)
	router.POST("/graph?:query", getExampleWebData)
	router.DELETE("/graph?:query", getExampleWebData)
	
	router.GET("/annotation/hello", getExampleWebData)
	
	router.GET("/annotation:query", getExampleWebData)
	router.POST("/annotation:query", getExampleWebData)
	router.PUT("/annotation:query", getExampleWebData)
    router.DELETE("/annotation:query", getExampleWebData)
	
	router.GET("/manifest", getExampleWebData)

	router.Run("localhost:9090")
}

func getExampleWebData(c *gin.Context){
	c.IndentedJSON(http.StatusOK, example_web_data)
}

func queryKongAPI(){

}

func queryCache(){

}

func query