"""
This is Code for VCAN based on Amazon's Color Skill Example
Github: https://github.com/wabry/VCAN 
"""

from __future__ import print_function
from lib import Request
from lib import Entity
from lib import Traverse
from lib import App
from lib import Folder
from lib import Debug
from lib import Screen
from lib import AppStore
import urllib
import httplib

# --------------- Helpers that build all of the responses ----------------------

def build_speechlet_response(title, output, reprompt_text, should_end_session):
    return {
        'outputSpeech': {
            'type': 'PlainText',
            'text': output
        },
        'card': {
            'type': 'Simple',
            'title': "SessionSpeechlet - " + title,
            'content': "SessionSpeechlet - " + output
        },
        'reprompt': {
            'outputSpeech': {
                'type': 'PlainText',
                'text': reprompt_text
            }
        },
        'shouldEndSession': should_end_session
    }


def build_response(session_attributes, speechlet_response):
    return {
        'version': '1.0',
        'sessionAttributes': session_attributes,
        'response': speechlet_response
    }


# --------------- Functions that control the skill's behavior ------------------
def send_request(intent, session):
    """Sends a Request for Debugging Purposes"""
    card_title = intent['name']
    session_attributes = {}
    should_end_session = False
    
    connection_debug = Debug()

    try:
        connection_debug.connect()
        speech_output = "The response status is: " + str(response.status) + ". And the reason is: " + response.reason
    except:
        speech_output = "Connection Failure"

    reprompt_text = ""
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def get_welcome_response():
    """ If we wanted to initialize the session to have some attributes we could
    add those here
    """

    session_attributes = {}
    card_title = "Welcome"
    speech_output = "VCAN Open. "

    # If the user either does not reply to the welcome message or says something
    # that is not understood, they will be prompted again with this text.
    reprompt_text = "Ready when you are!."
    should_end_session = False
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def handle_session_end_request():
    card_title = "Session Ended"
    speech_output = "Thank you for trying the Alexa Skills Kit sample. " \
                    "Have a nice day! "
    # Setting this to true ends the session and exits the skill.
    should_end_session = True
    return build_response({}, build_speechlet_response(
        card_title, speech_output, None, should_end_session))


def create_folder(intent, session):
    """Creates a folder for our application """
    
    session_attributes = {}
    card_title = intent['name']
    speech_output = "" # do we need this?
    reprompt_text = ""
    should_end_session = False
    folder_name = intent["slots"]["folderName"]["value"]

    folder = Folder()
    try:
        folder.create(folder_name)
    except:
        speech_output = "Failure occured while connecting, please try again."
    
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def delete_folder(intent, session):
    """Deletes a folder for our application """
    
    session_attributes = {}
    card_title = intent['name']
    speech_output = "" # do we need this?
    reprompt_text = ""
    should_end_session = False
    folder_name = intent["slots"]["folderIndex"]["value"]

    folder = Folder()
    try:
        folder.delete(folder_name)
    except:
        speech_output = "Failure occured while connecting, please try again."
    
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def move_folder(intent, session):
    """Moves a folder in our application """
    
    session_attributes = {}
    card_title = intent['name']
    speech_output = "" # do we need this?
    reprompt_text = ""
    should_end_session = False
    folder_name = intent["slots"]["folderIndex"]["value"]
    dest = intent["slots"]["destination"]["value"]

    folder = Folder()
    try:
        folder.move(folder_name, dest)
    except:
        speech_output = "Failure occured while connecting, please try again."
    
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def search_folder(intent, session):
    """Searches for a folder """
    
    session_attributes = {}
    card_title = intent['name']
    speech_output = "" # do we need this?
    reprompt_text = ""
    should_end_session = False
    folder_name = intent["slots"]["folderName"]["value"]

    folder = Folder()
    try:
        folder.search(folder_name)
    except:
        speech_output = "Failure occured while connecting, please try again."
    
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def rename_folder(intent, session):
    """Searches for a folder """
    
    session_attributes = {}
    card_title = intent['name']
    speech_output = "" # do we need this?
    reprompt_text = ""
    should_end_session = False
    old_name = intent["slots"]["oldName"]["value"]
    new_name = intent["slots"]["newName"]["value"]


    folder = Folder()
    try:
        folder.rename(old_name, new_name)
    except:
        speech_output = "Failure occured while connecting, please try again."
    
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def add_app(intent, session):
    """Searches for a folder """
    
    session_attributes = {}
    card_title = intent['name']
    speech_output = "" # do we need this?
    reprompt_text = ""
    should_end_session = False
    index = intent["slots"]["index"]["value"]
   
    app = App()
    try:
        app.add(index)
    except:
        speech_output = "Failure occured while connecting, please try again."
    
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def delete_app(intent, session):
    """Searches for a folder """
    
    session_attributes = {}
    card_title = intent['name']
    speech_output = "" # do we need this?
    reprompt_text = ""
    should_end_session = False
    app_name = intent["slots"]["appName"]["value"]

    app = App()
    try:
        app.delete(app_name)
    except:
        speech_output = "Failure occured while connecting, please try again."
    
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def move_app(intent, session):
    """Searches for a folder """
    
    session_attributes = {}
    card_title = intent['name']
    speech_output = "" # do we need this?
    reprompt_text = ""
    should_end_session = False
    app_name = intent["slots"]["appName"]["value"]
    dest = intent["slots"]["destination"]["value"]

    app = App()
    try:
        app.move(app_name, dest)
    except:
        speech_output = "Failure occured while connecting, please try again."
    
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def search_app(intent, session):
    """Searches for a folder """
    
    session_attributes = {}
    card_title = intent['name']
    speech_output = "" # do we need this?
    reprompt_text = ""
    should_end_session = False
    app_name = intent["slots"]["appName"]["value"]
    
    app = App()
    try:
        app.search(app_name)
    except:
        speech_output = "Failure occured while connecting, please try again."
    
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def traverse(intent, session):
    """Traverses the FileSystem """

    session_attributes = {}
    card_title = intent['name']
    speech_output = "" # do we need this?
    reprompt_text = ""
    should_end_session = False
    dest = intent["slots"]["dest"]["value"]
    
    traverse = Traverse()
    try:
        traverse.traverse(dest)
    except:
        speech_output = "Failure occured while connecting, please try again."
    
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def switch_screen(intent, session):
    """Switches the screen between App Store and apps page"""
    session_attributes = {}
    card_title = intent['name']
    speech_output = "" # do we need this?
    reprompt_text = ""
    should_end_session = False
    type = intent["slots"]["type"]["value"]
    
    screen = Screen()
    try:
        screen.switch_screen(type)
    except:
        speech_output = "Failure occured while connecting, please try again."
    
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))

def app_index(intent, session):
    """Input the index of the app a user wants to visit"""
    session_attributes = {}
    card_title = intent['name']
    speech_output = "" # do we need this?
    reprompt_text = ""
    should_end_session = False
    index = intent["slots"]["index"]["value"]
    
    appStore = AppStore()
    try:
        appStore.app_select(index)
    except:
        speech_output = "Failure occured while connecting, please try again."
    
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def category_index(intent, session):
    """Input the index of the category a user wants to visit"""
    session_attributes = {}
    card_title = intent['name']
    speech_output = "" # do we need this?
    reprompt_text = ""
    should_end_session = False
    index = intent["slots"]["index"]["value"]
    
    appStore = AppStore()
    try:
        appStore.category_select(index)
    except:
        speech_output = "Failure occured while connecting, please try again."
    
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def populate_apps(intent, session):
    """Populate DB with already installed apps"""
    session_attributes = {}
    card_title = intent['name']
    speech_output = "" # do we need this?
    reprompt_text = ""
    should_end_session = False
    
    app = App()
    try:
        app.populate()
    except:
        speech_output = "Failure occured while connecting, please try again."
    
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def text_size(intent, session):
    """Modify text size for accessibility."""
    session_attributes = {}
    card_title = intent['name']
    speech_output = "" # do we need this?
    reprompt_text = ""
    should_end_session = False
    size = intent["slots"]["size"]["value"]
    
    screen = Screen()
    try:
        screen.text_size(size)
    except:
        speech_output = "Failure occured while connecting, please try again."
    
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))


def toggle_mode(intent, session):
    """Change viewing mode for viewing in daytime and nighttime mode."""
    session_attributes = {}
    card_title = intent['name']
    speech_output = "" # do we need this?
    reprompt_text = ""
    should_end_session = False

    
    screen = Screen()
    try:
        screen.toggle_mode()
    except:
        speech_output = "Failure occured while connecting, please try again."
    
    return build_response(session_attributes, build_speechlet_response(
        card_title, speech_output, reprompt_text, should_end_session))

# --------------- Events ------------------

def on_session_started(session_started_request, session):
    """ Called when the session starts """

    print("on_session_started requestId=" + session_started_request['requestId']
          + ", sessionId=" + session['sessionId'])


def on_launch(launch_request, session):
    """ Called when the user launches the skill without specifying what they
    want
    """

    print("on_launch requestId=" + launch_request['requestId'] +
          ", sessionId=" + session['sessionId'])
    # Dispatch to your skill's launch
    return get_welcome_response()


def on_intent(intent_request, session):
    """ Called when the user specifies an intent for this skill """

    print("on_intent requestId=" + intent_request['requestId'] +
          ", sessionId=" + session['sessionId'])

    intent = intent_request['intent']
    intent_name = intent_request['intent']['name']

    # ALPHA
    if intent_name == "sendRequest":
        return send_request(intent, session)
    elif intent_name == "createFolder":
        return create_folder(intent, session)
    elif intent_name == "deleteFolder":
        return delete_folder(intent, session)
    elif intent_name == "moveFolder":
        return move_folder(intent, session)
    elif intent_name == "searchFolder":
        return search_folder(intent, session)
    elif intent_name == "renameFolder":
        return rename_folder(intent, session)
    elif intent_name == "addApplication":
        return add_app(intent, session)
    elif intent_name == "deleteApplication":
        return delete_app(intent, session)
    elif intent_name == "moveApplication":
        return move_app(intent, session)
    elif intent_name == "searchApplication":
        return search_app(intent, session)
        
    # BETA
    elif intent_name == "traverse":
        return traverse(intent, session)
    elif intent_name == "screenSwitch":
        return switch_screen(intent, session)
    elif intent_name == "appIndex":
        return app_index(intent, session)
    elif intent_name == "categoryIndex":
        return category_index(intent, session)
    elif intent_name == "populateApps":
        return populate_apps(intent, session)

    # Omega
    elif intent_name == "textSize":
        return text_size(intent, session)
    elif intent_name == "toggleMode":
        return toggle_mode(intent, session)

    elif intent_name == "AMAZON.HelpIntent":
        return get_welcome_response()
    elif intent_name == "AMAZON.CancelIntent" or intent_name == "AMAZON.StopIntent":
        return handle_session_end_request()
    else:
        session_attributes = {}
        card_title = "Error"
        speech_output = "Failure, please try again"
        reprompt_text = "The command issued was not recognized, please try again"
        should_end_session = False
        return build_response(session_attributes, build_speechlet_response(
            card_title, speech_output, reprompt_text, should_end_session))




def on_session_ended(session_ended_request, session):
    """ Called when the user ends the session.

    Is not called when the skill returns should_end_session=true
    """
    print("on_session_ended requestId=" + session_ended_request['requestId'] +
          ", sessionId=" + session['sessionId'])
    # add cleanup logic here


# --------------- Main handler ------------------

def lambda_handler(event, context):
    """ Route the incoming request based on type (LaunchRequest, IntentRequest,
    etc.) The JSON body of the request is provided in the event parameter.
    """
    print("event.session.application.applicationId=" +
          event['session']['application']['applicationId'])

    """
    Uncomment this if statement and populate with your skill's application ID to
    prevent someone else from configuring a skill that sends requests to this
    function.
    """
    if (event['session']['application']['applicationId'] !=
            "amzn1.ask.skill.7a2f03a5-4f04-4f7d-a4ed-26e55ebfc247"):
        raise ValueError("Invalid Application ID")

    if event['session']['new']:
        on_session_started({'requestId': event['request']['requestId']},
                          event['session'])

    if event['request']['type'] == "LaunchRequest":
        return on_launch(event['request'], event['session'])
    elif event['request']['type'] == "IntentRequest":
        return on_intent(event['request'], event['session'])
    elif event['request']['type'] == "SessionEndedRequest":
        return on_session_ended(event['request'], event['session'])
    else:
        session_attributes = {}
        card_title = "Error"
        speech_output = "Failure, please try again"
        reprompt_text = "The command issued was not recognized, please try again"
        should_end_session = False
        return build_response(session_attributes, build_speechlet_response(
            card_title, speech_output, reprompt_text, should_end_session))
        
