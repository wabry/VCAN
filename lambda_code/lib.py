import httplib
import urllib
import urllib2



class Request(object):
    def __init__(self):
        self.hostname = "chaffiest-budgerigar-7836.dataplicity.io"
        self.path = "/api/alexa/v1/"

    def send_request(self, http_method, action, params):
        headers = {}
        conn = httplib.HTTPSConnection(self.hostname + ":443") 
        conn.request(http_method, self.path + action + params, {}, headers)
        response = conn.getresponse()
        return response


class Entity(Request):
    def __init__(self, entity_type):
        Request.__init__(self)
        self.entity_type = entity_type


    def send_request(self, http_method, action, params):
        super(Entity, self).send_request(http_method, self.entity_type + action, params)

class Traverse(Request):
    def __init__(self, dest):
        Request.__init__(self)
        self.dest = dest

    def traverse():
        params = urllib.urlencode({"name": self.dest})
        return self.send_request("POST", "traverse", params)


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
        
        
    def add(self, name):
        params = urllib.urlencode({"name": name})
        return self.send_request("POST", "", self.arg1)


    def delete(self, name):
        params = urllib.urlencode({"name": name})
        return self.send_request("DELETE", "", params)
        

    def move(self, name, dest):
        params = urllib.urlencode({"name": name, "folder": dest})
        return self.send_request("POST", "move/", params)
        

    def search(self, query):
        params = urllib.urlencode({"query": query})
        return self.send_request("GET", "", params)


class Folder(Entity):
    def __init__(self):
        Entity.__init__(self, "folder/")


    def create(self, name):
        params = urllib.urlencode({"name": name})
        return self.send_request("POST", "/", params)


    def delete(self, name):
        params = urllib.urlencode({"name": name})
        return self.send_request("DELETE", "/", params)


    def move(self, name, dest):
        params = urllib.urlencode({"name": name, "folder": dest})
        return self.send_request("POST", "move/", params)


    def search(self, query):
        params = urllib.urlencode({"query": query})
        return self.send_request("GET", "search/", params)


    def rename(self, old_name, new_name):
        params = urllib.urlencode({"oldFolder": old_name, "newFolder": new_name})
        return self.send_request("PUT", "rename/", params)

