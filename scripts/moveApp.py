import sys, requests
appName = sys.argv[1]
destFolder = sys.argv[2]
payload = {'name' : appName, 'destFolder' : destFolder}
url = 'http://localhost:8000/api/alexa/v1/app/move/' + appName + '&' + destFolder
r = requests.post(url, payload)
print(r)
