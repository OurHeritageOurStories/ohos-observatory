f = open(r'ai_lab_2.ttl')
content = f.read()
lines = content.split('\n')
triplets = []
f = open("ai_lab_2_extracted.ttl", "a")
for i in lines:
	if "tanc:source" in i:
		line = i.replace("<<<http://dbpedia.org/resource/", "<:").replace("tanc", "<").replace(" <http://dbpedia.org/resource/", "> <:").replace(">>>", "> .\n >>").split(">>")[0]
		triplets.append(line)
		f.write(line)
