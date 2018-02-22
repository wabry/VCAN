import sys, requests
folderName = sys.argv[1]
url = 'http://localhost:8000/api/alexa/v1/folder/' + folderName
r = requests.delete(url)
print(r)
