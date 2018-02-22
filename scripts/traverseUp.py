import sys, requests
payload = {'name' : 'UP'}
url = 'http://localhost:8000/api/alexa/v1/traverse/UP'
r = requests.post(url, payload)
print(r)
