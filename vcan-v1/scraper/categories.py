import bs4, requests
import json
from bs4 import BeautifulSoup
url = "https://www.amazon.com/alexa-skills/b/ref=topnav_storetab_a2s?ie=UTF8&node=13727921011"
temp = []
count = 0
attempts = 1 
while attempts > 0:
    try:
        r = requests.get(url, headers = {'User-agent':"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:59.0) Gecko/20100101 Firefox/59.0"})
        #print(r.text)
        soup = BeautifulSoup(r.content, "html.parser")
        for li in soup.find(attrs={'aria-label': "Categories and Refinements"}).find(text="Alexa Skills").next.next:
            temp.append({"name": li.find('span').string, "url": li.find('a')['href'],"index": count })
            count = count +1
        break
    except AttributeError:
        attempts -= 1
temp = sorted(temp, key = lambda k : k['name'])
output = json.dumps(temp)
print(output)
