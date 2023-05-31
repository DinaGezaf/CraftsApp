import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  URL: string = 'http://localhost:3000/products';
  constructor(private http: HttpClient) {}
  getProducts(): any {
    return this.http.get(this.URL);
  }
  getById(id: any): any {
    return this.http.get<any>(`${this.URL}/${id}`);
  }
}
