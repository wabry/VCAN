import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
  result:any;

  constructor(private _http: Http) { }

  getPath() {
    return this._http.get("/api/alexa/v1/state")
      .map(res => this.result = res.json().path);
  }

  getApps() {
    return this._http.get("/api/alexa/v1/state")
      .map(res => this.result = res.json().apps);
  }

  getFolders() {
    return this._http.get("/api/alexa/v1/state")
      .map(result => this.result = result.json().folders);
  }
}