import sys, requests
folderName = sys.argv[1]
payload = {'name' : folderName}
url = 'http://localhost:8000/api/alexa/v1/traverse/' + folderName
r = requests.post(url, payload)
print(r)
