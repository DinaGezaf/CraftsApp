import { CartService } from 'src/app//Core/Service/cart.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ICart } from 'src/app/Core/Model/Cart.model';
import { AttentionsComponent } from 'src/app/Shared/attentions/attentions.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  totalCheckout!: number;
  displayedColumns: string[] = [
    'productName',
    'price',
    'quantity',
    'total',
    'Actions',
  ];
  dataSource!: MatTableDataSource<ICart>;

  // Pagination properties
  totalItems = 100;
  pageIndex = 0;
  pageSize = 10;
  cartItems: any;
  constructor(
    private cartService: CartService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Initialize table data
    this.cartService.getCart().subscribe((response: any) => {
      this.cartItems = response;
      this.dataSource = new MatTableDataSource(this.cartItems);
      console.log(this.cartItems);
    });
    this.getTotalCheckout();
  }
  loadCartItems() {
    this.cartService.getCart().subscribe((response: any) => {
      this.cartItems = response;
      this.dataSource = new MatTableDataSource(this.cartItems);
      console.log(this.cartItems);
    });
  }
  getTotalCheckout() {
    let sum = 0;
    this.cartService.getCart().subscribe((response: any) => {
      this.cartItems = response;
      console.log(this.cartItems);
      this.cartItems.forEach((item: ICart) => {
        let total = item.quantity * item.product.price;
        sum += total;
      });
      this.totalCheckout = sum;
      console.log(this.totalCheckout);
    });
  }
  updateCart(item: any): void {
    this.cartService
      .updateCartItemQuantity(item.id, item)
      .subscribe((data: any) => {
        console.log('Cart item updated successfully:', data);
      });
    this.getTotalCheckout();
  }

  removeItem(id: any): void {
    this.cartService.DeleteProductFromCart(id).subscribe(() => {
      this.cartItems = this.cartItems.filter((item: any) => {
        return item.id != id;
      });
      const config = new MatSnackBarConfig();
      config.duration = 3000;
      config.verticalPosition = 'top';
      this.snackBar.open('Product removed successfully!', '', config);
      this.cartService.decrementCartCount();
      this.loadCartItems();
      this.getTotalCheckout();
    });
  }

  order() {
    let date = new Date();
    const dialogRef = this.dialog.open(AttentionsComponent, {
      width: '300px',
      data: { message: 'Order will be delivered in 3 Days From Now ' + date },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }

  incrementQuantity(item: any) {
    item.quantity++;
    this.updateCart(item);
    this.getTotalCheckout();
  }

  decrementQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCart(item);
      this.getTotalCheckout();
    }
  }
}
