var express = require('express');
var router = express.Router();
var state = require('../stateModule');
var dbWrapper = require('../dbWrapper');

/* Display all of the recent actions completed */
router.get('/log', function(req, res, next) {
	var recentLog = state.stateModule.getLog();
	res.render('index', { log: recentLog });
});

/* Display all of the current folders and apps */
router.get('/status', function(req, res, next) {
	var path = state.stateModule.getPath();
	var apps = state.stateModule.getApps();
	var folders = state.stateModule.getFolders();
	res.render('status', { dir: path, app: apps, folder: folders });
});

/* Search for a folder */
router.get('/folder/:search_word', function(req, res, next) {
	// Search for the folder
	var searchName = req.params.search_word;
	var returnJSON = JSON.stringify(dbWrapper.searchFolder(searchName));
	// Log transaction
	state.stateModule.appendToLog('Search for folder ' + searchName);
	// Send back data
	res.contentType('application/json');
	res.send(returnJSON);
	res.end();
});

/* Search for an application */
router.get('/app/:search_word', function(req, res, next) {
	// Search for the app
	var searchName = req.params.search_word;
	var returnJSON = JSON.stringify(dbWrapper.searchApp(searchName));
	// Log transaction
	state.stateModule.appendToLog('Search for app ' + searchName);
	// Send back data
	res.contentType('application/json');
	res.send(returnJSON);
	res.end();
});

/* Search for anything related to a name */
router.get('/search/:search_word', function(req, res, next) {
	// Search for the app or folder
	var searchName = req.params.search_word;
	var returnJSON = JSON.stringify(dbWrapper.search(searchName));
	// Log transaction
	state.stateModule.appendToLog('Search for word ' + searchName);
	// Send back data
	res.contentType('application/json');
	res.send(returnJSON);
	res.end();
});

/* Create a folder */
router.post('/folder/:name', function(req, res, next) {
	// Create the folder
	var folderName = req.params.name;
	state.stateModule.addFolder(folderName);
	// Log transaction
	state.stateModule.appendToLog('Created folder ' + folderName);
	res.end();
});

/* Move a folder */
router.post('/folder/move/:name&:destFolder', function(req, res, next) {
	// Create the folder
	var folderName = req.params.name;
	var destFolder = req.params.destFolder;
	state.stateModule.moveFolder(folderName,destFolder);
	// Log transaction
	state.stateModule.appendToLog('Moved folder ' + appName + ' to folder ' + destFolder);
	res.end();
});

/* Delete a folder */
router.delete('/folder/:name', function(req, res, next) {
	// Delete the folder
	var folderName = req.params.name;
	state.stateModule.removeFolder(folderName);
	// Log transaction
	state.stateModule.appendToLog('Deleted folder ' + folderName);
	res.end();
});

/* Create an app */
router.post('/app/:name', function(req, res, next) {
	// Create the app
	var appName = req.params.name;
	state.stateModule.addApp(appName);
	// Log transaction
	state.stateModule.appendToLog('Created app ' + appName);
	res.end();
});

/* Move an app */
router.post('/app/move/:name&:destFolder', function(req, res, next) {
	// Create the folder
	var appName = req.params.name;
	var destFolder = req.params.destFolder;
	state.stateModule.moveApp(appName,destFolder);
	// Log transaction
	state.stateModule.appendToLog('Moved app ' + appName + ' to folder ' + destFolder);
	res.end();
});

/* Delete an app */
router.delete('/app/:name', function(req, res, next) {
	// Delete the folder
	var appName = req.params.name;
	state.stateModule.removeApp(appName);
	// Log transaction
	state.stateModule.appendToLog('Deleted app ' + appName);
	res.end();
});

/* Traverse through the filesystem */
router.post('/traverse/:dest', function(req,res,next) {
	// Go to the correct direction
	var destination = req.params.dest;
	if(destination == 'UP')
	{
		state.stateModule.traverseUp();
	}
	else
	{
		state.stateModule.traverseDown(destination);
	}
	// Log transaction
	state.stateModule.appendToLog('Traverse: ' + destination);
	res.end();
});

module.exports = router;
