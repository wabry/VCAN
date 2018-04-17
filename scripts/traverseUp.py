import sys, requests
payload = {'name' : 'up'}
url = 'http://localhost:8000/api/alexa/v1/traverse/up'
r = requests.post(url, payload)
print(r)
