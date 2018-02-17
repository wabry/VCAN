// This file controls the current state of the file system at any given time
// TODO - Add exceptions/error handling
var dbWrapper = require('./dbWrapper'); // Add to interact with the database

var stateModule = (function() {
    // State of transactions
    var log = [];
    // State of the filesystem
    var parentFolder = '';     // Current parent directory, initialized to nothing
    var currentFolder = '/';   // Current directory, initialized to root
    var folders = [];       // Folders in current directory
    var apps = [];          // Apps in current directory

    var pub = {};   // public object - returned at end of module

    /***** Log Functionality *****/
    pub.appendToLog = function (action) {
        log.unshift(action);
    };
    pub.getLog = function() {
        return log;
    };
    pub.getPath = function (action) {
        return currentFolder;
    };
    /***** App Functionality  ******/
    // Add the app to the app list
    pub.addApp = function (appName) {
        // Add the app to the app list
        apps.push(appName);
        // Add the app to the database
        dbWrapper.addApp(appName,currentFolder);
        // Return the list of apps
        return apps;
    };
    // Move the app
    pub.moveApp = function (appName, destFolder) {
        // Remove the folder from the list and db
        removeApp(appName);
        // Add the folder to the right place in the db
        dbWrapper.addApp(appName,destFolder);
        // Return the list of apps
        return apps;
    };
    // Remove an app from the app list
    pub.removeApp = function (appName) {
        // Find the app to delete, and delete if found
        for(var i=0; i<apps.length; i++)
        {
            if(appName == apps[i])
            {
                apps.splice(i,1);
            }
        }
        // Delete the app from the database
        dbWrapper.removeApp(appName,currentFolder);
        // Return the list of apps
        return apps;
    };
    // Get all apps from the app list
    pub.getApps = function() {
        return apps;
    };

    /****** Folder Functionality ******/
    // Add the folder to the folder list
    pub.addFolder = function (folderName) {
        // Add the folder to the folder list
        folders.push(folderName);
        // Add the folder to the database
        dbWrapper.addFolder(folderName,currentFolder);
        // Return the list of folders
        return folders;
    };
    // Move the folder
    pub.moveFolder = function (folderName, destFolder) {
        // Remove the folder from the list and db
        removeFolder(folderName);
        // Add the folder to the right place in the db
        dbWrapper.addFolder(folderName,destFolder);
        // Return the list of folders
        return folders;
    };
    // Remove an folder from the folder list
    pub.removeFolder = function (folderName) {
        // Find the folder to delete, and delete if found
        for(var i=0; i<apps.length; i++)
        {
            if(folderName == folders[i])
            {
                folders.splice(i,1);
            }
        }
        // Delete the folder from the database
        dbWrapper.removeFolder(folderName,currentFolder);
        // Return the list of folders
        return folders;
    };
    // Get all folders in the current directory
    pub.getFolders = function() {
        return folders;
    };

    /***** Directory Functionality *****/
    // Traverse to the parent folder
    pub.traverseUp = function () {
        // If no parent, cannot traverse up
        if(parentFolder == '') 
        {

        }
        else 
        {
            // Update the current and parent folders
            currentFolder = parentFolder;
            parentFolder = dbWrapper.getParent(currentFolder);
            // Update the folders and apps
            apps = dbWrapper.getApps(currentFolder);
            folders = dbWrapper.getFolders(currentFolder);
        }
    };
    // Traverse to a sub folder
    pub.traverseDown = function(folderName) {
        // If the folder doesnt exist, cannot traverse down
        if(!elementExists(folders,folderName))
        {

        }
        else
        {
            // Update the current and parent folders
            parentFolder = currentFolder;
            currentFolder = folderName;
            // Update the folders and apps
            apps = dbWrapper.getApps(currentFolder);
            folders = dbWrapper.getFolders(currentFolder);
        }
    };

    return pub; // Expose externally
})();

// Returns true if an element exists in the array arr
function elementExists(arr,element) {
    for(var i=0; i<arr.length; i++)
    {
        if(element == arr[i]) { return true; }
    }
    return false;
}

// Export the state module to other files
module.exports.stateModule = stateModule;