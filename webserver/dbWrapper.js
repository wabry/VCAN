// This file wraps database commands for interaction with the webserver - these are blocking
class dbWrapper {
    static getApps (folder) {
        // Gets all apps in a folder
        var apps = [];
        return apps;
    }
    static addApp (app, folder) {
        // Adds the app to the folder
    }

    static removeApp (app, folder) {
        // Removes the app from the folder
    }

    static getFolders (folder) {
        // Gets all folders in a folder
        var folders = [];
        return folders;
    }

    static addFolder (folderToAdd, folder) {
        // Adds the folderToAdd to the folder
    }

    static removeFolder (folderToRemove, folder) {
        // Removes the folderToRemove from the folder
    }

    static getParent(folder) {
        // Gets the parent folder of a folder
        var parent ='';
        return parent;
    }

    static search (searchName) {
    	// Searches the database for something with the name
    }

    static searchFolder (folderName) {
    	// Searches the database for the folderName
    }

    static searchApp (appName) {
    	// Searches the database for the appName
    }
}

module.exports = dbWrapper;