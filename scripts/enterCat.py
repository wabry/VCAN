import sys, requests
catIndex = sys.argv[1]
payload = {'category' : catIndex}
url = 'http://localhost:8000/api/alexa/v1/appStore/category/' + catIndex
r = requests.post(url, payload)
print(r)