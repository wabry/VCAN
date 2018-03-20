import bs4, requests
import json
from bs4 import BeautifulSoup
url = "https://www.amazon.com/alexa-skills/b/ref=topnav_storetab_a2s?ie=UTF8&node=13727921011"
r = requests.get(url)
#print(r.text)
soup = BeautifulSoup(r.content, "html.parser")
temp = []
count = 0;
for li in soup.find(attrs={'aria-label': "Categories and Refinements"}).find(text="Alexa Skills").next.next:
    temp.append({"name": li.find('span').string, "url": li.find('a')['href'],"index": count })
    count = count +1

temp = sorted(temp, key = lambda k : k['name'])
output = json.dumps(temp)
print(output)
