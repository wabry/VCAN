import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
  result:any;

  constructor(private _http: Http) { }

  /* Overall Commands */
  getPageName() {
    return this._http.get("/api/alexa/v1/state/page")
      .map(res => this.result = res.json().pageName);
  }

  /* File System Commands */
  getPath() {
    return this._http.get("/api/alexa/v1/state/path")
      .map(res => this.result = res.json().path);
  }
  getApps() {
    return this._http.get("/api/alexa/v1/state/apps")
      .map(res => this.result = res.json().apps);
  }
  getFolders() {
    return this._http.get("/api/alexa/v1/state/folders")
      .map(result => this.result = result.json().folders);
  }

  /* Store Commands */
  getStoreView() {
    return this._http.get("/api/alexa/v1/state/storeView")
      .map(result => this.result = result.json().title);
  }
  getCategoryList() {
    return this._http.get("/api/alexa/v1/state/categories")
      .map(result => this.result = result.json().categories);
  }
  getStoreAppNames() {
    return this._http.get("/api/alexa/v1/state/appList")
      .map(result => this.result = result.json().apps);
  }
  getStoreAppUtterance() {
    return this._http.get("/api/alexa/v1/state/appList")
      .map(result => this.result = result.json().utterances);
  }
  getStoreAppDeveloper() {
    return this._http.get("/api/alexa/v1/state/appList")
      .map(result => this.result = result.json().developers);
  }
  getStoreAppImage() {
    return this._http.get("/api/alexa/v1/state/appList")
      .map(result => this.result = result.json().images);
  }

}