import {Component, OnInit} from '@angular/core';
import {ProductInterface} from '../../interfaces/product.interface';
import {ProductService} from '../../services/product.service';
import {HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {
    faSortAlphaDown,
    faSortAlphaUp,
    faSortAmountDown,
    faSortAmountUp,
    faSortNumericDown,
    faSortNumericUp,
    faPlusSquare
} from '@fortawesome/free-solid-svg-icons';
import {SessionService} from '../../services/session.service';
import {UtilService} from '../../services/util.service';
import {PopoverController} from '@ionic/angular';
import {SortComponent} from '../../components/sort/sort.component';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.page.html',
    styleUrls: ['./product-list.page.scss'],
})
export class ProductListPage implements OnInit {
    products: ProductInterface[] = [];
    sortValues = [
        {name: 'Name', icon: faSortAlphaUp, value: 'name'},
        {name: 'Name', icon: faSortAlphaDown, value: '-name'},
        {name: 'Price', icon: faSortAmountUp, value: 'price'},
        {name: 'Price', icon: faSortAmountDown, value: '-price'},
        {name: 'Stock', icon: faSortNumericDown, value: 'stock'},
        {name: 'Stock', icon: faSortNumericUp, value: '-stock'},
    ];
    viewEdit: boolean;
    sortContext: { name: string, icon: any, value: string };
    searchText: string;
    isLoading: boolean;
    faPlusSquare = faPlusSquare;
    next: string;
    sort: string;

    constructor(private productService: ProductService,
                private sessionService: SessionService,
                private router: Router,
                private utilService: UtilService,
                private popoverController: PopoverController) {
    }

    ngOnInit() {
        this.fetchProducts(true);
        this.viewEdit = this.sessionService.isAdmin() || this.sessionService.isAuditor();
    }

    fetchProducts(emptyArray?: boolean, link?: string, infiniteScroll?: any) {
        this.isLoading = true;
        this.utilService.presentLoading('Loading Products...');
        if (emptyArray) {
            this.products = [];
        }
        let params = new HttpParams().set('page_size', '10');
        if (this.searchText) {
            params = params.set('search', this.searchText);
        }
        if (this.sort) {
            this.sortContext = this.sortValues.find(sv => sv.value === this.sort);
        }
        this.sortContext = this.sortContext || this.sortValues[0];
        params = params.set('ordering', this.sortContext.value);
        this.productService.getProducts(params, link).subscribe(response => {
            this.products = this.products.concat(response.results);
            this.next = response.next;
            console.log(this.products);
            if (infiniteScroll) {
                infiniteScroll.target.complete();
            }
            this.isLoading = false;
            this.utilService.dismissLoading();
        }, () => {
            if (infiniteScroll) {
                infiniteScroll.target.complete();
            }
            this.utilService.dismissLoading();
            this.isLoading = false;
        });
    }

    onCancelSearch(ev) {
        this.searchText = '';
    }

    async showAlert() {
        const popOver = await this.popoverController.create({
            component: SortComponent,
            componentProps: {
                sortValues: this.sortValues
            },
            animated: true
        });
        await popOver.present();
        await popOver.onDidDismiss().then(data => {
            console.log(data);
            if (data.data) {
                this.sort = data.data.value;
                this.fetchProducts(true);
            }
        });
    }

    doInfiniteScroll(infiniteScroll) {
        this.fetchProducts(false, this.next, infiniteScroll);
    }
}
