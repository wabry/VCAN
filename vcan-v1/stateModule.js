// This file controls the current state of the system at any given time
// TODO - Add exceptions/error handling
// TODO - Add functionality for path and folder
var dbWrapper = require('./dbWrapper'); // Add to interact with the database

var stateModule = (function() {
    // State of transactions
    var log = [];
    // Type of the page we are currently on
    var pageName = 'Home';
    // State of the filesystem
    var path = '~';               // Current path of the system
    var parentFolder = 'root';        // Current parent directory, initialized to nothing
    var currentFolder = 'root';   // Current directory, initialized to root, has no parent
    var folders = [];             // Folders in current directory
    var apps = [];                // Apps in current directory
    // State of the store view
    var storeView = 'Categories';
    var categoryList = [];
    var storeAppNames = [];
    var storeAppUtterance = [];
    var storeAppDeveloper = [];
    var storeAppImage = [];

    var pub = {};   // public object - returned at end of module

    /* Functions to edit the page name */
    pub.updatePage = function(pageType) {
        pageName = pageType;
    };
    pub.getPageName = function() {
        return pageName;
    };

    /* Functions to handle store view perspective */
    pub.changeCategoryView = function(storeName, newCategoryList) {
        storeView = storeName;
        categoryList = [];
        for(var i=0; i<newCategoryList.length;i++) {
            categoryList.push(newCategoryList[i].name);
        }
    };

    pub.changeAppView = function(storeName, newAppList) {
        storeView = storeName;
        storeAppNames = [];
        storeAppUtterance = [];
        storeAppDeveloper = [];
        storeAppImage = [];
        for(var i=0; i<newAppList.length;i++) {
            storeAppNames.push(newAppList[i].name);
            storeAppUtterance.push(newAppList[i].utterance);
            storeAppDeveloper.push(newAppList[i].developer);
            storeAppImage.push(newAppList[i].image);
        }
    };

    pub.getStoreView = function() {
        return storeView;
    };
    pub.getCategories = function() {
        return categoryList;
    };
    pub.getStoreAppNames = function() {
        return storeAppNames;
    };
    pub.getStoreAppUtterance = function() {
        return storeAppUtterance;
    };
    pub.getStoreAppDeveloper = function() {
        return storeAppDeveloper;
    };
    pub.getStoreAppImage = function() {
        return storeAppImage;
    };

    /* Callback functions */
    pub.getAppsCb = function(dbApps) {
        apps = [];
        for(var i=0; i<dbApps.length;i++) {
            apps.push(dbApps[i].name);
        }
    };
    pub.getFolderCb = function(dbFolders) {
        folders = [];
        for(var i=0; i<dbFolders.length;i++) {
            folders.push(dbFolders[i].name);
        }
    };
    pub.getParentCb = function(dbParent) {
        // Update the folders
        currentFolder = parentFolder;
        parentFolder = dbParent[0].parentName;
        // Update the folders and apps
        dbWrapper.getApps(currentFolder,pub.getAppsCb);
        dbWrapper.getFolders(currentFolder,pub.getFolderCb);
    };

    /***** Log Functionality *****/
    pub.appendToLog = function (time,action) {
        log.unshift(time + ' --- ' + action);
    };
    pub.getLog = function() {
        return log;
    };
    pub.getPath = function (action) {
        return path;
    };
    /***** App Functionality  ******/
    // Add the app to the app list
    pub.addApp = function (appName) {
        // Add the app to the database
        dbWrapper.addApp(appName,currentFolder);    // async
    };
    // Remove an app from the app list
    pub.removeApp = function (appName) {
        // Delete the app from the database
        dbWrapper.removeApp(appName,currentFolder);    // async
    };
    // Move the app
    pub.moveApp = function (appName, destFolder) {
        // Remove the folder from the list and db
        pub.removeApp(appName);
        // Add the folder to the right place in the db
        dbWrapper.addApp(appName,destFolder);    // async
    };
    // Get all apps from the app list
    pub.getApps = function() {
        dbWrapper.getApps(currentFolder,pub.getAppsCb);
        return apps;
    };

    /****** Folder Functionality ******/
    // Add the folder to the folder list
    pub.addFolder = function (folderName) {
        // Add the folder to the database
        dbWrapper.addFolder(folderName,currentFolder);    // async
    };
    // Remove an folder from the folder list
    pub.removeFolder = function (folderName) {
        // Delete the folder from the database
        dbWrapper.removeFolder(folderName,currentFolder);    // async
    };
    // Move the folder
    pub.moveFolder = function (folderName, destFolder) {
        // Remove the folder from the list and db
        pub.removeFolder(folderName);
        // Add the folder to the right place in the db
        dbWrapper.addFolder(folderName,destFolder);    // async
    };
    // Get all folders in the current directory
    pub.getFolders = function() {
        dbWrapper.getFolders(currentFolder,pub.getFolderCb);
        return folders;
    };

    /***** Directory Functionality *****/
    // Traverse to the parent folder
    pub.traverseUp = function () {
        // Update the path if necessary
        if(!(parentFolder == 'root' && currentFolder == 'root'))
        {
            path = moveUpPath(path);
        }
        // Update the current and parent folders
        currentFolder = parentFolder;
        dbWrapper.getParent(currentFolder,pub.getParentCb);
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
            path = moveDownPath(path,currentFolder);
            // Update the folders and apps
            dbWrapper.getApps(currentFolder,pub.getAppsCb);    // async
            dbWrapper.getFolders(currentFolder,pub.getFolderCb);    // async
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

// Returns an updated path, moving up one folder
function moveUpPath(path) {
    var lastFolder;
    for(var i=path.length-1; i>=0; i--)
    {
        if(path[i] == '/') 
        { 
            lastFolder = i;
            break;
        }
    }
    return path.slice(0,lastFolder);
}

// Returns an updated path, moving down one folder
function moveDownPath(path, folder) {
    return path.concat('/' + folder);
}

// Export the state module to other files
module.exports.stateModule = stateModule;