import sys, requests
folderName = sys.argv[1]
destFolder = sys.argv[2]
payload = {'name' : folderName, 'destFolder' : destFolder}
url = 'http://localhost:8000/api/alexa/v1/folder/move/' + folderName + '&' + destFolder
r = requests.post(url, payload)
print(r)
