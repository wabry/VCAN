import sys, requests
screenName = sys.argv[1]
payload = {'name' : screenName}
url = 'http://localhost:8000/api/alexa/v1/screen/' + screenName
r = requests.post(url, payload)
print(r)