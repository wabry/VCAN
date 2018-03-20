# VCAN
Voice Controlled Application Navigation - a project for the Accessibility Software Design course at the University of Michigan

# Current API interface
/api/alexa/v1/folder/?name=<string:name> POST, DELETE --- create/delete a folder <br>
/api/alexa/v1/app/?name=<string:name> POST, DELETE --- create/delete an application  <br>
/api/alexa/v1/traverse/?name=<string:name/UP> POST --- go into a folder named "name" or UP for the parent folder  <br>
/api/alexa/v1/app/move/?name=<string:name>&dest=<string:name/UP> POST --- Move an application  <br>
/api/alexa/v1/folder/move/?name=<string:name>&dest=<string:name/UP> POST --- Move a folder  <br>
