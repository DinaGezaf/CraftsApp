import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/Core/Service/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent {
  Id: any;
  product: any;
  constructor(
    public activatedRoute: ActivatedRoute,
    private productService: ProductService,
    public router: Router
  ) {
    this.Id = this.activatedRoute.snapshot.params['id'];
  }
  ngOnInit(): void {
    this.productService.getById(this.Id).subscribe((response: any) => {
      this.product = response;
    });
  }
  back() {
    this.router.navigate(['/products']);
  }
}
