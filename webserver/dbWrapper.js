// This file wraps database commands for interaction with the webserver
class dbWrapper {
    static addApp (app, folder) {
        // Adds the app to the folder
    }

    static removeApp (app, folder) {
        // Removes the app from the folder
    }

    static addFolder (folderToAdd, folder) {
        // Adds the folderToAdd to the folder
    }

    static removeFolder (folderToRemove, folder) {
        // Removes the folderToRemove from the folder
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