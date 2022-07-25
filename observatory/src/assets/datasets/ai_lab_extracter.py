lines = open(r'ai_lab_2.ttl').read().split('\n')
triplets = []
f = open("ai_lab_2_extracted.ttl", "w")
for j, i in enumerate(lines):
	if "tanc:source" in i:
		line = i.replace("<<<", "<").replace("tanc", "<").replace(" <http://dbpedia.org/resource/", "> <http://dbpedia.org/resource/").replace(">>>", "> .\n>>").split(">>")[0]
		f.write(line)
		#print(line)
	elif "tanc:similarity" in i:
		subject = i.split("tanc:")[1][9:-3]
		while "tanc:start" not in lines[j+1]:
			#print(subject, lines[j+1].split(":")[1].split(" ")[1], lines[j+1].split(":")[2].split(" ")[0])
			if lines[j+1].split(":")[1].split(" ")[1] == "Wikidata":
				obj = "<http://www.wikidata.org/entity/" + lines[j+1].split(":")[2].split(" ")[0] + "> .\n"
			else:
				obj = "<http://dbpedia.org/resource/" + lines[j+1].split(":")[2].split(" ")[0] + "> .\n"
			line = subject + "<:" + lines[j+1].split(" ")[0] ">" + obj
			j=j+1
			#print(line)
			f.write(line)
