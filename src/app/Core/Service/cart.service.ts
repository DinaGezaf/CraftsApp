import { ICart } from './../Model/Cart.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  URL: string = 'http://localhost:3000/cart';
  private cartCountSubject: Subject<number> = new Subject<number>();
  cartCount$ = this.cartCountSubject.asObservable();
  private cartCount: number = 0;
  constructor(private http: HttpClient) {}

  getCartCount() {
    return this.cartCount;
  }
  incrementCartCount() {
    this.cartCount++;
    this.cartCountSubject.next(this.cartCount);
    this.updateCartCount(this.cartCount);
  }

  decrementCartCount() {
    this.cartCount--;
    this.cartCountSubject.next(this.cartCount);
    this.updateCartCount(this.cartCount);
  }

  updateCartCount(count: number) {
    const url = 'http://localhost:3000/counts/1';
    this.http.patch(url, { countCart: count }).subscribe();
  }

  getCart() {
    return this.http.get(this.URL);
  }
  AddProductToCart(cartItem: ICart): any {
    return this.http.post(this.URL, cartItem);
  }
  DeleteProductFromCart(id: any): any {
    return this.http.delete(`${this.URL}/${id}`);
  }

  getCartItem(product: any): any {
    return this.http.get(this.URL + `?id=${product.id}`);
  }
  checkCart(item: ICart): Observable<boolean> {
    return this.http
      .get<any[]>(this.URL + `?product.id=${item.product.id}`)
      .pipe(map((cart) => cart.length > 0));
  }
  updateCartItemQuantity(id: any, item: any) {
    return this.http.put(`${this.URL}/${id}`, item);
  }

  
}
