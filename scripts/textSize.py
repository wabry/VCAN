import sys, requests
textSize = sys.argv[1]
payload = {'size' : textSize}
url = 'http://localhost:8000/api/alexa/v1/screen/text/' + textSize
r = requests.post(url, payload)
print(r)
