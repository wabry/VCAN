import sys, requests
appName = sys.argv[1]
payload = {'name' : appName}
url = 'http://localhost:8000/api/alexa/v1/app/' + appName
r = requests.post(url, payload)
print(r)
