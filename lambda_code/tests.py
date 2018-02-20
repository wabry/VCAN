import lib
import unittest
from lambda_function import *

class Setup(object):
    @staticmethod
    def build_intent():
        intent = {}
        intent["name"] = "test boi"
        intent["slots"] = {}
        intent["slots"]["folderName"] = {}
        intent["slots"]["folderName"]["value"] = "NewFolder"
        return intent
    
    @staticmethod
    def build_session():
        return {}


class FolderTests(unittest.TestCase):
    def test_create_folder(self):
        intent = Setup.build_intent()
        session = Setup.build_session()
        resp = create_folder(intent, session)
        self.assertEqual(resp["response"]["outputSpeech"]["text"], "Success")
    
    def test_delete_folder(self):
        intent = Setup.build_intent()
        session = Setup.build_session()
        resp = delete_folder(intent, session)
        self.assertEqual(resp["response"]["outputSpeech"]["text"], "Success")



if __name__ == '__main__':
    unittest.main()