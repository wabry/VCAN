import { Component, OnInit, OnDestroy } from '@angular/core';

// Import the DataService
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  // Define the path, apps, and folders to hold data
  path: any;
  apps: Array<any>;
  folders: Array<any>;
  // Define an interval for refreshing
  interval:any;

  // Called on init, sets up the auto refresh
  ngOnInit() {
    this.refreshData();
    this.interval = setInterval(() => {
        this.refreshData(); 
    }, 1000);
  }

  // Called on destroy
  ngOnDestroy() {
    clearInterval(this.interval);
  }

  // TODO reduce JSON calls while keeping the folders dynamic
  
  // Called to dynamically refresh the data
  refreshData() {
    // Get the path
    this._dataService.getPath()
    .subscribe(res => this.path = res);
    // Get the apps
    this._dataService.getApps()
    .subscribe(res => this.apps = res);
    // Get the folders
    this._dataService.getFolders()
    .subscribe(res => this.folders = res);
  }
  
  // Create an instance of the DataService through dependency injection
  constructor(private _dataService: DataService) {
    // Get the path
    this._dataService.getPath()
    .subscribe(res => this.path = res);
    // Get the apps
    this._dataService.getApps()
    .subscribe(res => this.apps = res);
    // Get the folders
    this._dataService.getFolders()
    .subscribe(res => this.folders = res);
  }
  
}