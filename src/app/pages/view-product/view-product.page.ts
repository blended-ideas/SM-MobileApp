import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProductService} from '../../services/product.service';
import {UtilService} from '../../services/util.service';
import {ProductInterface} from '../../interfaces/product.interface';
import {HttpParams} from '@angular/common/http';

@Component({
    selector: 'app-view-product',
    templateUrl: './view-product.page.html',
    styleUrls: ['./view-product.page.scss'],
})
export class ViewProductPage implements OnInit {
    product: ProductInterface;

    constructor(private route: ActivatedRoute,
                private productService: ProductService,
                private utilService: UtilService) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (paramMap.has('productId')) {
                this.fetchProductById(paramMap.get('productId'));
            }
        });
    }

    fetchProductById(id) {
        this.utilService.presentLoading('Fetching Product Detail');
        this.productService.getProductById(id).subscribe(response => {
            this.product = response;
            this.utilService.dismissLoading();
        }, () => {
            this.utilService.dismissLoading();
        });
    }

    // getProductStockChanges() {
    //     const params = new HttpParams()
    //         .set('product', this.product.id)
    //         .set('page', this.productStockChangePaginationHelper.currentPage.toString())
    //         .set('page_size', this.productStockChangePaginationHelper.pageSize.toString());
    //     this.productStockChangeLoading = true;
    //     this.productService.getProductStockChanges(params).subscribe(response => {
    //         this.productStockChangeLoading = false;
    //         this.productStockChanges = response.results;
    //         this.productStockChangePaginationHelper.totalSize = response.count;
    //     }, () => {
    //         this.productStockChangeLoading = false;
    //     });
    // }

}
