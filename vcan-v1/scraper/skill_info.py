import sys
import requests
import json
from bs4 import BeautifulSoup 

def get_json(url):
    #url = 'https://www.amazon.com/s/ref=lp_13727921011_nr_n_1?fst=as%3Aoff&rh=n%3A13727921011%2Cn%3A%2113727922011%2Cn%3A14284865011&bbn=13727922011&ie=UTF8&qid=1520952570&rnid=13727922011'
    check = 0
    url = "https://www.amazon.com" + url
    while(check == 0):
        totalpage = requests.get(url, headers = {'User-agent':"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:59.0) Gecko/20100101 Firefox/59.0"})
        #print(totalpage.text[:500])
        soup = BeautifulSoup(totalpage.text, 'html.parser')
        skills_containers = soup.find_all('div',class_ = 's-item-container')
        check = len(skills_containers)
	#print (skills_containers[0])
	#print (skills_containers[0].img['src'])
	#print (skills_containers[0].find('span', class_ = 'a-text-italic').text)

	#print first_skill.text
    length = len(skills_containers) - 1
    temp = []
    for i in range(0,length):
        name = skills_containers[i].h2.text
        appurl = skills_containers[i].a['href']
        image = skills_containers[i].img['src']
        developer = skills_containers[i].span.text
        commands = skills_containers[i].find_all('span', class_ = 'a-text-italic')
        command = ""
        if len(commands) > 0:
            command = commands[0].text.strip()
        temp.append({"name": name, "image": image, "developer": developer, "utterance": command})


    output = json.dumps(temp)
    return output



#<a class="a-link-normal s-access-detail-page  s-color-twister-title-link a-text-normal" 
#title="Mastermind - SMS Text Messaging &amp; Phone Calls" 
#href="https://www.amazon.com/Mastermind-Text-Messaging-Phone-Calls/dp/B01N0HFLPG/ref=lp_14284865011_1_1?s=digital-skills&amp;ie=UTF8&amp;qid=1520952576&amp;sr=1-1">
#<h2 data-attribute="Mastermind - SMS Text Messaging &amp; Phone Calls" data-max-rows="0" 
#class="a-size-medium s-inline  s-access-title  a-text-normal">Mastermind - SMS Text Messaging &amp; Phone Calls</h2></a>




url = sys.argv[1]
print (get_json(url))
