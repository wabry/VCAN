var express = require('express');
var router = express.Router();
var state = require('../stateModule');
var dbWrapper = require('../dbWrapper');

/* State handling for angular interaction */
let response = {
	status: 200,
	path: '',
	apps: [],
	folders: []
};

/* Get the current state, used by angular front end */
router.get('/state', function(req, res, next) {
	response.path = state.stateModule.getPath();
	response.apps = state.stateModule.getApps();
	response.folders = state.stateModule.getFolders();
	res.json(response);
});

/* Display all of the recent actions completed */
router.get('/log', function(req, res, next) {
	var recentLog = state.stateModule.getLog();
	res.render('index', { log: recentLog });
});

/* Search for a folder */
router.get('/folder/:search_word', function(req, res, next) {
	// Search for the folder
	var searchName = adjustName(req.params.search_word);
	var returnJSON = JSON.stringify(dbWrapper.searchFolder(searchName));
	// Log transaction
	state.stateModule.appendToLog(Date(),'Search for folder ' + searchName);
	// Send back data
	res.contentType('application/json');
	res.send(returnJSON);
	res.end();
});

/* Search for an application */
router.get('/app/:search_word', function(req, res, next) {
	// Search for the app
	var searchName = adjustName(req.params.search_word);
	var returnJSON = JSON.stringify(dbWrapper.searchApp(searchName));
	// Log transaction
	state.stateModule.appendToLog(Date(),'Search for app ' + searchName);
	// Send back data
	res.contentType('application/json');
	res.send(returnJSON);
	res.end();
});

/* Search for anything related to a name */
router.get('/search/:search_word', function(req, res, next) {
	// Search for the app or folder
	var searchName = adjustName(req.params.search_word);
	var returnJSON = JSON.stringify(dbWrapper.search(searchName));
	// Log transaction
	state.stateModule.appendToLog(Date(),'Search for word ' + searchName);
	// Send back data
	res.contentType('application/json');
	res.send(returnJSON);
	res.end();
});

/* Create a folder */
router.post('/folder/:name', function(req, res, next) {
	// Create the folder
	var folderName = adjustName(req.params.name);
	state.stateModule.addFolder(folderName);
	// Log transaction
	state.stateModule.appendToLog(Date(),'Created folder ' + folderName);
	res.end();
});

/* Move a folder */
router.post('/folder/move/:name&:destFolder', function(req, res, next) {
	// Create the folder
	var folderName = adjustName(req.params.name);
	var destFolder = adjustName(req.params.destFolder);
	state.stateModule.moveFolder(folderName,destFolder);
	// Log transaction
	state.stateModule.appendToLog(Date(),'Moved folder ' + appName + ' to folder ' + destFolder);
	res.end();
});

/* Delete a folder */
router.delete('/folder/:name', function(req, res, next) {
	// Delete the folder
	var folderName = adjustName(req.params.name);
	state.stateModule.removeFolder(folderName);
	// Log transaction
	state.stateModule.appendToLog(Date(),'Deleted folder ' + folderName);
	res.end();
});

/* Create an app */
router.post('/app/:name', function(req, res, next) {
	// Create the app
	var appName = adjustName(req.params.name);
	state.stateModule.addApp(appName);
	// Log transaction
	state.stateModule.appendToLog(Date(),'Created app ' + appName);
	res.end();
});

/* Move an app */
router.post('/app/move/:name&:destFolder', function(req, res, next) {
	// Create the folder
	var appName = adjustName(req.params.name);
	var destFolder = adjustName(req.params.destFolder);
	state.stateModule.moveApp(appName,destFolder);
	// Log transaction
	state.stateModule.appendToLog(Date(),'Moved app ' + appName + ' to folder ' + destFolder);
	res.end();
});

/* Delete an app */
router.delete('/app/:name', function(req, res, next) {
	// Delete the folder
	var appName = adjustName(req.params.name);
	state.stateModule.removeApp(appName);
	// Log transaction
	state.stateModule.appendToLog(Date(),'Deleted app ' + appName);
	res.end();
});

/* Traverse through the filesystem */
router.post('/traverse/:dest', function(req,res,next) {
	// Go to the correct destination
	var destination = adjustName(req.params.dest);
	if(destination == 'UP')
	{
		state.stateModule.traverseUp();
	}
	else
	{
		state.stateModule.traverseDown(destination);
	}
	// Log transaction
	state.stateModule.appendToLog(Date(),'Traverse: ' + destination);
	res.end();
});

// Helper to adjust an inputted name
function adjustName(name) {
    var equalsSpot = -1;
    for(var i=name.length-1; i>=0; i--)
    {
        if(name[i] == '=') 
        { 
            equalsSpot = i;
            break;
        }
    }
    return name.substring(equalsSpot+1);
};

module.exports = router;