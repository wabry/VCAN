import sys, requests
appIndex = sys.argv[1]
payload = {'index' : appIndex}
url = 'http://localhost:8000/api/alexa/v1/appStore/app/' + appIndex
r = requests.post(url, payload)
print(r)