var express = require('express');
var router = express.Router();
var state = require('../stateModule');
var dbWrapper = require('../dbWrapper');
var PythonShell = require('python-shell');

/* State handling for angular interaction */
let response = {
	status: 200,
	path: '',
	apps: [],
	folders: []
};

/* Get the current state, used by angular front end */
router.get('/state/page', function(req, res, next) {
	response.pageName = state.stateModule.getPageName();
	res.json(response);
});
router.get('/state/path', function(req, res, next) {
	response.path = state.stateModule.getPath();
	res.json(response);
});
router.get('/state/apps', function(req, res, next) {
	response.apps = state.stateModule.getApps();
	res.json(response);
});
router.get('/state/folders', function(req, res, next) {
	response.folders = state.stateModule.getFolders();
	res.json(response);
});
router.get('/state/storeView', function(req, res, next) {
	response.title = state.stateModule.getStoreView();
	res.json(response);
});
router.get('/state/categories', function(req, res, next) {
	response.categories = state.stateModule.getCategories();
	res.json(response);
});
router.get('/state/appList', function(req, res, next) {
	response.apps = state.stateModule.getStoreAppNames();
	response.utterances = state.stateModule.getStoreAppUtterance();
	response.developers = state.stateModule.getStoreAppDeveloper();
	response.images = state.stateModule.getStoreAppImage();
	res.json(response);
});

/* Display all of the recent actions completed */
router.get('/log', function(req, res, next) {
	var recentLog = state.stateModule.getLog();
	res.render('log', { log: recentLog });
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
	if(destination == 'up')
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

/* Swap between the apps page and the apps store */
router.post('/screen/:name', function(req, res, next) {
	// Get the type to swap to
	var type = adjustName(req.params.name);
	if (type == 'filesystem') {
		// Switch to app view
		state.stateModule.updatePage('Filesystem');
	}
	else if (type == 'store') {
		// Switch to store view, starting at the categories
		updateCategories();
		state.stateModule.updatePage('StoreCategories');
	}
	else if (type == 'home') {
		// Switch to home view
		state.stateModule.updatePage('Home');
	}
	else if (type == 'help') {
		// Switch to help view
		state.stateModule.updatePage('Help');
	}
	// Log transaction
	state.stateModule.appendToLog(Date(),'Swapped screens to ' + type);
	res.end();
});

/* Dive into a category in the store view */
router.post('/appStore/category/:index', function(req, res, next) {
	// Get the category index
	var categoryIndex = adjustName(req.params.index);
	// Only accept these requests if we are in the Categories page
	if(state.stateModule.getStoreView() == 'Categories' || categoryIndex == -1)
	{
		// If index = -1 then move up to the parent category view & update the view
		if(categoryIndex == -1) {
			// Update the categories
			updateCategories();
			// Log transaction
			state.stateModule.appendToLog(Date(),'Switched to main category view');
		}
		// Otherwise, get the list of categories and select what to enter
		else if (categoryIndex >= 0 && categoryIndex <= 22) {
			// Update the apps of that category
			updateApps(categoryIndex);
			// Log transaction
			state.stateModule.appendToLog(Date(),'Entered category ' + categoryName);
		}
	}
	res.end();
});

/* Download an app */
router.post('/appStore/app/:index', function(req, res, next) {
	// Get the inputted index
	var appIndex = adjustName(req.params.index);
	// Get the categories list to find the correct category name
	var cat_options = {
		mode: 'json'
	};
	// Get the specific category from the python scraper
	PythonShell.run('/scraper/categories.py', cat_options, function (cat_err, categories) {
		if (cat_err) throw cat_err;
		console.log("*************");
		// Get the category
		for(var i=0;i<categories[0].length;i++)
		{
			if(categories[0][i].name == state.stateModule.getStoreView())
			{
				var category = categories[0][i];
				console.log(category);
				// Get the app list
				var app_options = {
					mode: 'json',
					args: [category.url]
				};
				PythonShell.run('/scraper/skill_info.py', app_options, function (apps_err, apps) {
					if (apps_err) throw apps_err;
					// Add the app at app index to the downloads
					var appName = apps[0][appIndex].name;
					state.stateModule.addAppToDownloads(appName);
				});
			}
		}
	});
	console.log("*************");
	// Log transaction
	state.stateModule.appendToLog(Date(),'Downloaded app with index ' + appIndex);
	res.end();
});

/* Add all downloaded apps on alexa to our page */
router.post('/app/populate', function(req, res, next) {
	// Populate all of our downloaded apps - TODO implement this

	// Log transaction
	state.stateModule.appendToLog(Date(),'Populated apps');
	res.end();
});

// Helper function to update the categories in the system state
function updateCategories() {
	// Define the options and arguments for the call to the python scraper
	var options = {
		mode: 'json'
	};
	// Get the category list from the python shell
	PythonShell.run('/scraper/categories.py', options, function (err, results) {
		if (err) throw err;
		var categories = results[0];
		var categoryNames = [];
		for(var i=0;i<categories.length;i++)
		{
			categoryNames.push(categories[i]);
		}
		state.stateModule.updatePage('StoreCategories');
		state.stateModule.changeCategoryView('Categories',categoryNames);
	});
}

// Helper function to get a list of skills under a specific URL
function updateApps(categoryIndex) {
	// Get the categories list to find the correct category name
	var cat_options = {
		mode: 'json'
	};
	// Get the specific category from the python scraper
	PythonShell.run('/scraper/categories.py', cat_options, function (cat_err, categories) {
		if (cat_err) throw cat_err;
		// Get the category
		var category = categories[0][categoryIndex];
		// Update the apps with the apps in this category
		var app_options = {
			mode: 'json',
			args: [category.url]
		};
		PythonShell.run('/scraper/skill_info.py', app_options, function (apps_err, apps) {
			if (apps_err) throw apps_err;
			// Update the state module
			state.stateModule.updatePage('StoreSkills');
			state.stateModule.changeAppView(category.name, apps[0]);
		});
	});
}

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