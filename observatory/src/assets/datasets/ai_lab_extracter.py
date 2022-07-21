lines = open(r'ai_lab_2.ttl').read().split('\n')
triplets = []
f = open("ai_lab_2_extracted.ttl", "w")
for i in lines:
	if "tanc:source" in i:
		line = i.replace("<<<", "<:").replace("tanc", "<").replace(" <http://dbpedia.org/resource/", "> <:http://dbpedia.org/resource/").replace(">>>", "> .\n>>").split(">>")[0]
		f.write(line)
