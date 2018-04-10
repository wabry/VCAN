import httplib
import urllib
import urllib2
from collections import OrderedDict


class Request(object):
    def __init__(self):
        self.hostname = "67.205.149.226"
        self.port = 8080
        self.path = "/api/alexa/v1/"

    def send_request(self, http_method, action, params):
        headers = {}
        conn = httplib.HTTPConnection(self.hostname, self.port)
        conn.request(http_method, self.path + action + params, "", headers)
        response = conn.getresponse()
        return response


class Entity(Request):
    def __init__(self, entity_type):
        Request.__init__(self)
        self.entity_type = entity_type

    def send_request(self, http_method, action, params):
        super(Entity, self).send_request(http_method, self.entity_type + action, params)

class Screen(Request):
    def __init__(self):
        Request.__init__(self)

    def switch_screen(self, type):
        params = urllib.urlencode({"type": type})
        return self.send_request("POST", "screen/", params)

    def text_size(self, size):
        params = urllib.urlencode({"size": size})
        return self.send_request("POST", "screen/text/", params)

    def toggle_mode(self):
        params = urllib.urlencode({})
        return self.send_request("POST", "screen/toggleMode/", params)


class AppStore(Entity):
    def __init__(self):
        Entity.__init__(self, "appStore/")

    def category_select(self, index):
        params = urllib.urlencode({"index": index})
        return self.send_request("POST", "category/", params)

    def app_select(self, index):
        params = urllib.urlencode({"index": index})
        return self.send_request("POST", "app/", params)


class Traverse(Request):
    def __init__(self):
        Request.__init__(self)

    def traverse(self, dest):
        params = urllib.urlencode({"dest": dest})
        return self.send_request("POST", "traverse/", params)


class Debug(Request):
    def __init__(self):
        Request.__init__(self)

    def connect(self):
        params = urllib.urlencode({"test": "Testing Connection"})
        response = self.send_request("POST", "connect", params)
        return response.status

class App(Entity):
    def __init__(self):
        Entity.__init__(self, "app/")
        
        
    def add(self, index):
        params = urllib.urlencode({"index": index})
        return self.send_request("POST", "", params)


    def delete(self, name):
        params = urllib.urlencode({"name": name})
        return self.send_request("DELETE", "", params)
        

    def move(self, name, dest):
        params = urllib.urlencode(OrderedDict([("name", name), ("destFolder", dest)]))
        return self.send_request("POST", "move/", params)
        

    def search(self, query):
        params = urllib.urlencode({"query": query})
        return self.send_request("GET", "", params)
        
    def populate(self):
        params = urllib.urlencode({})
        return self.send_request("POST", "", params)

class Folder(Entity):
    def __init__(self):
        Entity.__init__(self, "folder/")


    def create(self, name):
        params = urllib.urlencode({"name": name})
        return self.send_request("POST", "", params)


    def delete(self, name):
        params = urllib.urlencode({"name": name})
        return self.send_request("DELETE", "", params)


    def move(self, name, dest):
        params = urllib.urlencode(OrderedDict([("name", name), ("destFolder", dest)]))
        return self.send_request("POST", "move/", params)


    def search(self, query):
        params = urllib.urlencode({"query": query})
        return self.send_request("GET", "search/", params)


    def rename(self, old_name, new_name):
        params = urllib.urlencode(OrderedDict([("oldFolder", old_name), ("newFolder", new_name)]))
        return self.send_request("PUT", "rename/", params)

