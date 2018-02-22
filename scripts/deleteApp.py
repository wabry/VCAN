import sys, requests
appName = sys.argv[1]
url = 'http://localhost:8000/api/alexa/v1/app/' + appName
r = requests.delete(url)
print(r)
