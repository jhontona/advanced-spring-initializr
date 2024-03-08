import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  constructor(private http: HttpClient) { }

  leerArchivo(nombreArchivo: string): Observable<string> {
    const url = `assets/templates/DDD/${nombreArchivo}`;
    return this.http.get(url, {responseType: 'text'});
  }
}
