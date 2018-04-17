import sys, requests
payload = {}
url = 'http://localhost:8000/api/alexa/v1/screen/toggleMode'
r = requests.post(url, payload)
print(r)