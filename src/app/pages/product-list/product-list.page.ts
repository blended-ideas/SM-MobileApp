import {Component, OnInit} from '@angular/core';
import {ProductInterface} from '../../interfaces/product.interface';
import {ProductService} from '../../services/product.service';
import {HttpParams} from '@angular/common/http';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
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
import {AlertController, PopoverController} from '@ionic/angular';
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

    constructor(private productService: ProductService,
                private route: ActivatedRoute,
                private sessionService: SessionService,
                private router: Router,
                private utilService: UtilService,
                private popoverController: PopoverController) {
    }

    ngOnInit() {
        this.route.queryParamMap.subscribe(queryParamMap => {
            this.fetchProducts(true, null, queryParamMap);
        });
        this.viewEdit = this.sessionService.isAdmin() || this.sessionService.isAuditor();
    }

    changeQueryParam(paramType: 'search' | 'sort', paramValue: string | number) {
        const queryParams = {
            sort: this.sortContext.value,
            search: this.searchText
        };
        switch (paramType) {
            case 'search':
                queryParams.search = paramValue as string;
                break;
            case 'sort':
                queryParams.sort = paramValue as string;
                break;
        }
        this.router.navigate(['.'], {
            relativeTo: this.route,
            queryParamsHandling: 'merge',
            queryParams
        });
    }

    fetchProducts(emptyArray?: boolean, link?: string, queryParamMap?: ParamMap, infiniteScroll?: any) {
        this.isLoading = true;
        this.utilService.presentLoading('Loading Products...');
        if (emptyArray) {
            this.products = [];
        }
        let params = new HttpParams().set('page_size', '10');
        console.log(queryParamMap);
        if (queryParamMap.has('search')) {
            this.searchText = queryParamMap.get('search');
            params = params.set('search', this.searchText);
        }
        if (queryParamMap.has('sort')) {
            const sortString = queryParamMap.get('sort');
            this.sortContext = this.sortValues.find(sv => sv.value === sortString);
        }
        this.sortContext = this.sortContext || this.sortValues[0];
        console.log(this.sortContext.value, 'this.sortContext.value');
        params = params.set('ordering', this.sortContext.value);
        this.productService.getProducts(params, link).subscribe(response => {
            this.products = response.results;
            console.log(this.products);
            this.isLoading = false;
            this.utilService.dismissLoading();
        }, () => {
            this.utilService.dismissLoading();
            this.isLoading = false;
        });
    }

    onCancelSearch(ev) {
        this.searchText = '';
        this.changeQueryParam('search', this.searchText);
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
                this.changeQueryParam('sort', data.data.value);
            }
        });
    }
}
