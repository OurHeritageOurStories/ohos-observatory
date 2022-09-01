lines = open(r'ai_lab_3.ttl').read().split('\n')
triplets = []
f = open("ai_lab_3_extracted.ttl", "w")
for j, i in enumerate(lines):
	if "tanc:mention" in i:
		line = i.replace("<<", "<").replace(" tanc:mentions", "> <tanc:mentions>").replace(">>>", "> .\n>>").split(">>")[0]
		f.write(line)
	elif "tanc:surfaceForm" in i:
		line = lines[j-3].replace("<<<", "<").replace(" <", "> <").replace(" tanc:", "> <tanc:").replace(">>>", "> .\n>>").split(">>>")[0]
		print(i, lines[j-3], line, lines[j-3].replace("<<<", "<"), lines[j-3].replace("<<<", "<").replace(" <", "> <"), lines[j-3].replace("<<<", "<").replace(" <", "> <").replace(" tanc:", "> <tanc:"), lines[j-3].replace("<<<", "<").replace(" <", "> <").replace(" tanc:", "> <tanc:").replace(">>>", "> .\n>>"))
		f.write(line)
