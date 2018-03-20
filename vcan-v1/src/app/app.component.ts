import { Component, OnInit, OnDestroy } from '@angular/core';

// Import the DataService
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  // Define the page of the name we are on
  pageName: any;
  // Define the path, apps, and folders to hold filesystem data
  path: any;
  apps: Array<any>;
  folders: Array<any>;
  // Define the elements to hold the store data
  storeView: any;
  categoryList: Array<any>;
  storeAppNames: Array<any>;
  storeAppUtterance: Array<any>;
  storeAppDeveloper: Array<any>;
  storeAppImage: Array<any>;
  // Define an interval for refreshing
  interval:any;

  // Called on init, sets up the auto refresh
  ngOnInit() {
    this.refreshData();
    this.interval = setInterval(() => {
        this.refreshData(); 
    }, 200);
  }

  // Called on destroy
  ngOnDestroy() {
    clearInterval(this.interval);
  }

  // TODO reduce JSON calls while keeping the folders dynamic
  
  // Called to dynamically refresh the data
  refreshData() {
    // Get information for the filesystem
    this._dataService.getPath().subscribe(res => this.path = res);
    this._dataService.getApps().subscribe(res => this.apps = res);
    this._dataService.getFolders().subscribe(res => this.folders = res);
    // Get the current page name
    this._dataService.getPageName().subscribe(res => this.pageName = res);
    // Get information for the store
    this._dataService.getStoreView().subscribe(res => this.storeView = res);
    this._dataService.getCategoryList().subscribe(res => this.categoryList = res);
    this._dataService.getStoreAppNames().subscribe(res => this.storeAppNames = res);
    this._dataService.getStoreAppUtterance().subscribe(res => this.storeAppUtterance = res);
    this._dataService.getStoreAppDeveloper().subscribe(res => this.storeAppDeveloper = res);
    this._dataService.getStoreAppImage().subscribe(res => this.storeAppImage = res);
  }
  
  // Create an instance of the DataService through dependency injection
  constructor(private _dataService: DataService) {
    // Get information for the filesystem
    this._dataService.getPath().subscribe(res => this.path = res);
    this._dataService.getApps().subscribe(res => this.apps = res);
    this._dataService.getFolders().subscribe(res => this.folders = res);
    // Get the current page name
    this._dataService.getPageName().subscribe(res => this.pageName = res);
    // Get information for the store
    this._dataService.getStoreView().subscribe(res => this.storeView = res);
    this._dataService.getCategoryList().subscribe(res => this.categoryList = res);
    this._dataService.getStoreAppNames().subscribe(res => this.storeAppNames = res);
    this._dataService.getStoreAppUtterance().subscribe(res => this.storeAppUtterance = res);
    this._dataService.getStoreAppDeveloper().subscribe(res => this.storeAppDeveloper = res);
    this._dataService.getStoreAppImage().subscribe(res => this.storeAppImage = res);
  }
  
}