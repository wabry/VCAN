// The main routing file for all VCAN HTTP Requests
var http = require('http');
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
router.get('/state/customization', function(req, res, next) {
	response.textSize = state.stateModule.getTextSize();
	response.nightMode = state.stateModule.getNightMode();
	res.json(response);
});
router.get('/state/errors', function(req, res, next) {
	response.errorBool = state.stateModule.getErrorBool();
	response.errorMsg = state.stateModule.getErrorMsg();
	res.json(response);
});

/* Display all of the recent actions completed, internal use only */
router.get('/log', function(req, res, next) {
	var recentLog = state.stateModule.getLog();
	res.render('log', { log: recentLog });
});

/* Customization Features */
// Change the text size
router.post('/screen/text/:size', function(req, res, next) {
	try {
		// Change the text size
		var newTextSize = adjustName(req.params.size);
		if(newTextSize == 'small' || newTextSize == '1') {
			state.stateModule.setTextSize('-1');
			state.stateModule.appendToLog(Date(),'Changed text to small');
			displaySuccess(true);
		} else if (newTextSize == 'medium' || newTextSize == '2') {
			state.stateModule.setTextSize('+1');
			state.stateModule.appendToLog(Date(),'Changed text to medium');
			displaySuccess(true);
		} else if (newTextSize == 'large' || newTextSize == '3') {
			state.stateModule.setTextSize('+2');
			state.stateModule.appendToLog(Date(),'Changed text to large');
			displaySuccess(true);
		} else {
			// Size input not valid
			setError('Please specify text size with small, medium, or large');
		}
	} catch(err) {
		state.stateModule.appendToLog(Date(),'Error: ' + err);
		setError('Unknown error - please try again');
	} finally {
		res.end();
	}
});

// Toggle the mode
router.post('/screen/toggleMode', function(req, res, next) {
	try {
		// Toggle the mode
		state.stateModule.toggleNightMode();
		// Log transaction
		state.stateModule.appendToLog(Date(),'Toggled night mode');
		displaySuccess(true);
	} catch(err) {
		state.stateModule.appendToLog(Date(),'Error: ' + err);
		setError('Unknown error - please try again');
	} finally {
		res.end();
	}
});

/* Create a folder */
router.post('/folder/:name', function(req, res, next) {
	try {
		// Create the folder
		var folderName = adjustName(req.params.name);
		state.stateModule.addFolder(folderName);
		// Log transaction
		state.stateModule.appendToLog(Date(),'Created folder ' + folderName);
		displaySuccess(true);
	} catch(err) {
		state.stateModule.appendToLog(Date(),'Error: ' + err);
		setError('Unknown error - please try again');
	} finally {
		res.end();
	}
});

/* Move a folder */
router.post('/folder/move/:name&:destFolder', function(req, res, next) {
	try {
		state.stateModule.appendToLog(Date(),'In the function');
		// Get the current folder list
		var currentFolders = state.stateModule.getFolders();
		// Get the folder to move and destination folder
		var folderName = getFolderName(currentFolders,req.params.name);
		var dest = getFolderName(currentFolders,req.params.destFolder);
		if(folderName == dest) {
			// Can't move folder into itself
			state.stateModule.appendToLog(Date(),'Cannot move a folder into itself!');
			setError('Cannot move a folder into itself!');
		} else if (!existsInList(currentFolders,folderName)) {
			// Target folder doesn't exist
			state.stateModule.appendToLog(Date(),'The target folder does not exist in the working directory!');
			setError('The target folder does not exist in the working directory!');
		} else if (!existsInList(currentFolders,dest) && dest != state.stateModule.getParent()) {
			// Destination folder doesn't exist
			state.stateModule.appendToLog(Date(),'The destination folder does not exist in the working directory!');
			setError('The destination folder does not exist in the working directory!');
		} else {
			// Move the folder
			state.stateModule.moveFolder(folderName,dest);
			// Log transaction
			state.stateModule.appendToLog(Date(),'Moved folder ' + folderName + ' to folder ' + dest);
			displaySuccess(true);
		}
	} catch(err) {
		state.stateModule.appendToLog(Date(),'Error: ' + err);
		setError('Unknown error - please try again');
	} finally {
		res.end();
	}
});

/* Delete a folder */
router.delete('/folder/:name', function(req, res, next) {
	try {
		// Delete the folder
		var currentFolders = state.stateModule.getFolders();
		var folderName = getFolderName(currentFolders,req.params.name);
		if(!existsInList(currentFolders,folderName)) {
			// Folder isn't in working directory
			setError('Folder is not in the current working directory!');
		} else {
			// Delete the folder
			state.stateModule.removeFolder(folderName);
			// Log transaction
			state.stateModule.appendToLog(Date(),'Deleted folder ' + folderName);
			displaySuccess(true);
		}
	} catch(err) {
		state.stateModule.appendToLog(Date(),'Error: ' + err);
		setError('Unknown error - please try again');
	} finally {
		res.end();
	}
});

/* Move an app */
router.post('/app/move/:name&:destFolder', function(req, res, next) {
	try {
		// Get the current lists
		var currentFolders = state.stateModule.getFolders();
		var currentApps = state.stateModule.getApps();
		// Move the app
		var appName = getAppName(currentApps,req.params.name);
		var destFolder = getFolderName(currentFolders,req.params.destFolder);
		if(!existsInList(currentApps,appName)) {
			// App is not in working directory
			setError('App is not in the current working directory!');
		} else if (!existsInList(currentFolders,destFolder) && destFolder != state.stateModule.getParent()) {
			// Folder is not in working directory
			setError('Folder is not in the current working directory!');
		} else {
			// Move the app
			state.stateModule.moveApp(appName,destFolder);
			// Log transaction
			state.stateModule.appendToLog(Date(),'Moved app ' + appName + ' to folder ' + destFolder);
			displaySuccess(true);
		}
	} catch(err) {
		state.stateModule.appendToLog(Date(),'Error: ' + err);
		setError('Unknown error - please try again');
	} finally {
		res.end();
	}
});

/* Delete an app */
router.delete('/app/:name', function(req, res, next) {
	try {
		// Delete the app
		var currentApps = state.stateModule.getApps();
		var appName = adjustName(currentApps,req.params.name);
		if(!existsInList(currentApps,appName)) {
			// App doesn't exist in current apps
			setError('App is not in the current working directory!');
		} else {
			// Remove the app
			state.stateModule.removeApp(appName);
			// Log transaction
			state.stateModule.appendToLog(Date(),'Deleted app ' + appName);
			displaySuccess(true);
		}
	} catch(err) {
		state.stateModule.appendToLog(Date(),'Error: ' + err);
		setError('Unknown error - please try again');
	} finally {
		res.end();
	}
});

/* Traverse through the filesystem */
router.post('/traverse/:dest', function(req,res,next) {
	try {
		// Go to the correct destination
		var currentFolders = state.stateModule.getFolders();
		var destination = getFolderName(currentFolders,req.params.dest);
		if(destination == state.stateModule.getParent() || destination == 'up')
		{
			// Traverse to the parent folder
			state.stateModule.traverseUp();
			// Log transaction
			state.stateModule.appendToLog(Date(),'Traversed up');
			displaySuccess(true);
		}
		else
		{
			// Traverse to dest if it is oen of the current folders
			if(!existsInList(currentFolders,destination)) {
				// Destination not in working directory
				setError('Folder not in the current working directory!');
			} else {
				// Traverse into folder
				state.stateModule.traverseDown(destination);
				// Log transaction
				state.stateModule.appendToLog(Date(),'Traverse: ' + destination);
				displaySuccess(true);
			}
		}
	} catch(err) {
		state.stateModule.appendToLog(Date(),'Error: ' + err);
		setError('Unknown error - please try again');
	} finally {
		res.end();
	}
});

/* Swap between the apps page and the apps store */
router.post('/screen/:name', function(req, res, next) {
	try {
		// Get the type to swap to
		var type = adjustName(req.params.name);
		if (type == 'filesystem') {
			// Switch to app view
			state.stateModule.updatePage('Filesystem');
			displaySuccess(true);
		}
		else if (type == 'store') {
			// Switch to store view, starting at the categories
			updateCategories();
			state.stateModule.updatePage('StoreCategories');
			displaySuccess(true);
		}
		else if (type == 'home') {
			// Switch to home view
			state.stateModule.updatePage('Home');
			displaySuccess(true);
		}
		else if (type == 'help') {
			// Switch to help view
			state.stateModule.updatePage('Help');
			displaySuccess(true);
		} else {
			// Unknown screen
			setError('Please choose either home, help, filesystem, or store');
		}
		// Log transaction
		state.stateModule.appendToLog(Date(),'Swapped screens to ' + type);
	} catch(err) {
		state.stateModule.appendToLog(Date(),'Error: ' + err);
		setError('Unknown error - please try again');
	} finally {
		res.end();
	}
});

/* Dive into a category in the store view */
router.post('/appStore/category/:index', function(req, res, next) {
	try {
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
				displaySuccess(true);
			}
			// Otherwise, get the list of categories and select what to enter
			else if (categoryIndex >= 0 && categoryIndex <= 22) {
				// Update the apps of that category
				updateApps(categoryIndex);
				// Log transaction
				state.stateModule.appendToLog(Date(),'Entered a category');
				displaySuccess(true);
			}
			// Otherwise, set an error
			else {
				setError('Please choose a valid category!');
			}
		}
	} catch(err) {
		state.stateModule.appendToLog(Date(),'Error: ' + err);
		setError('Unknown error - please try again');
	} finally {
		res.end();
	}
});

/* Download an app */
router.post('/appStore/app/:index', function(req, res, next) {
	try {
		// Get the inputted index
		var appIndex = adjustName(req.params.index);
		// Get the categories list to find the correct category name
		var cat_options = {
			mode: 'json'
		};
		// Get the specific category from the python scraper
		PythonShell.run('/scraper/categories.py', cat_options, function (cat_err, categories) {
			if (cat_err) throw cat_err;
			// Get the category
			for(var i=0;i<categories[0].length;i++)
			{
				if(categories[0][i].name == state.stateModule.getStoreView())
				{
					var category = categories[0][i];
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
		// Log transaction
		state.stateModule.appendToLog(Date(),'Downloaded app with index ' + appIndex);
		displaySuccess(true);
	} catch(err) {
		state.stateModule.appendToLog(Date(),'Error: ' + err);
		setError('Unknown error - please try again');
	} finally {
		res.end();
	}
});

// Wrapper to clear an error message
function clearError() {
	// Clear the error message in the state module
	state.stateModule.clearError();
}

// Wrapper to set an error message
function setError(message) {
	// Show that there has been an error
	displaySuccess(false);
	// Set the error in the state module
	state.stateModule.setError(message);
	// Clear the error after 5 seconds
	setTimeout(clearError, 5000);
}

// Helper function to determine if a string is in a list
function existsInList(listIn,stringIn) {
	if (stringIn == "")
	{
		return false;
	}
	var i = listIn.length;
	while(i--) {
		if(listIn[i] == stringIn)
		{
			return true;
		}	
	}
	return false;
}

// Helper function to get the folder name given the current folders structure and a parameter
function getFolderName(folders,rawName) {
	var param = adjustName(rawName);
	// If the folder name is numeric
	if(isNumeric(param)) {
		var folderInt = parseInt(rawName,10);
		if(folderInt == -1 || param == '-1') {
			return state.stateModule.getParent();
		} else if (folderInt < folders.length && folderInt >= 0) {
			return folders[folderInt];
		} else {
			return "";
		}
	} else {
		return param;
	}
}

// Helper function to get the app name given the current folders structure and a parameter
function getAppName(apps,rawName) {
	var param = adjustName(rawName);
	// If the folder name is numeric
	if(isNumeric(param)) {
		var appInt = parseInt(rawName,10);
		if (appInt < apps.length && appInt >= 0) {
			return apps[appInt];
		} else {
			return "";
		}
	} else {
		return param;
	} 
}

// Helper function to determine if a string is numeric
function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
  }

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

// Function to display a received request off of the neopixel ring
function displaySuccess(success) {
	// Make the correct request to the neopixel flask server, running on localhost:3000
	if(success) {
		http.get('http://localhost:3000/success',(resp)=>{});
	} else {
		http.get('http://localhost:3000/failure',(resp)=>{});
	}
}

module.exports = router;