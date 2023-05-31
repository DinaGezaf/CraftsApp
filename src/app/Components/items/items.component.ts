import { AttentionsComponent } from './../../Shared/attentions/attentions.component';
import { AuthService } from 'src/app/Core/Service/auth.service';
import { IProduct } from './../../Core/Model/Product.model';
import { CartService } from 'src/app/Core/Service/cart.service';
import { Component } from '@angular/core';
import { ProductService } from 'src/app/Core/Service/product.service';
import { ICart } from 'src/app/Core/Model/Cart.model';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
})
export class ItemsComponent {
  CartItem: any;
  products!: IProduct[];
  checkCart!: boolean;
  cart!: ICart;
  searchText: string = '';
  selectedCategory: string = '';
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit() {
    this.productService.getProducts().subscribe((p: any) => {
      this.products = p;
    });
  }

  searchProducts(): void {
    let filteredItems = this.products;
    if (this.searchText !== '') {
      filteredItems = filteredItems.filter((product) =>
        product.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

  filteredProducts() {
    let filteredProducts = this.products;

    if (this.selectedCategory !== '') {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === this.selectedCategory
      );
    }

    if (this.searchText !== '') {
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    return filteredProducts;
  }

  AddToCart(item: any) {
    if (this.authService.LoggedIn()) {
      this.cartService
        .checkCart({ product: item, quantity: 1 })
        .subscribe((response) => {
          this.checkCart = response;
          if (this.checkCart) {
            const dialogRef = this.dialog.open(AttentionsComponent, {
              width: '300px',
              data: { message: 'Product Already Exist in Your Cart !!' },
            });

            dialogRef.afterClosed().subscribe((result) => {
              console.log('The dialog was closed');
            });
          } else {
            const config = new MatSnackBarConfig();
            config.duration = 3000;
            config.verticalPosition = 'top';
            this.snackBar.open('Product added successfully!', '', config);
            this.cartService
              .AddProductToCart({ product: item, quantity: 1 })
              .subscribe((response: any) => {
                this.cart = response;
                this.cartService.incrementCartCount();
              });
          }
        });
    } else {
      const dialogRef = this.dialog.open(AttentionsComponent, {
        width: '300px',
        data: { message: 'Please log in to add items to your cart.' },
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed');
      });
    }
  }
}
