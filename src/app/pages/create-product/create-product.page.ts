/* tslint:disable */
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {SessionService} from '../../services/session.service';
import {ProductInterface} from '../../interfaces/product.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../services/product.service';
import {Observable} from 'rxjs';
import {UtilService} from '../../services/util.service';
import {faEdit, faPlusSquare} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-create-product',
    templateUrl: './create-product.page.html',
    styleUrls: ['./create-product.page.scss'],
})
export class CreateProductPage implements OnInit {
    productForm: FormGroup;
    product: ProductInterface;
    mode: 'Create' | 'Edit' = 'Create';
    initialLoading: boolean;
    isCreating: boolean;

    faPlusSquare = faPlusSquare;
    faEdit = faEdit;
    validation_messages = {
        name: [],
        category: [],
        price: [],
        landing_price: [],
        distributor_margin: [],
        retailer_margin: [],
        stock: [],
        barcode_entry: []
    };

    constructor(private sessionService: SessionService,
                private fb: FormBuilder,
                private route: ActivatedRoute,
                private productService: ProductService,
                private router: Router,
                private utilService: UtilService) {
    }

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (paramMap.has('productId')) {
                this.mode = 'Edit';
                this.fetchProduct(paramMap.get('productId'));
            } else {
                this.buildForm();
            }
        });
    }

    createProduct() {
        this.utilService.presentLoading('Creating Product');
        this.isCreating = true;
        const postObj = JSON.parse(JSON.stringify(this.productForm.value));

        let apiCall: Observable<ProductInterface>;
        const successMessage = `Product ${this.mode === 'Create' ? 'Created' : 'Edited'}`;

        if (this.mode === 'Create') {
            apiCall = this.productService.createProducts(postObj);
        } else {
            apiCall = this.productService.updateProduct(this.product.id, postObj);
        }
        apiCall.subscribe(response => {
            this.utilService.presentToast(successMessage, 2000);
            this.isCreating = false;
            this.utilService.dismissLoading();
            this.router.navigate(['/product']);
        }, () => {
            this.utilService.presentToast('Something went wrong while creating the product/service', 2000);
            this.utilService.dismissLoading();
            this.isCreating = false;
        });
    }

    private buildForm() {
        this.productForm = this.fb.group({
            created_by: [this.sessionService.user.id],

            name: this.fb.control(this.product && this.product.name || '', [Validators.required, Validators.maxLength(250)]),
            category: this.fb.control(this.product && this.product.category || '', [Validators.maxLength(500)]),

            price: this.fb.control(this.product && this.product.price || null, [Validators.required, Validators.max(90000000), Validators.min(0)]),
            landing_price: this.fb.control(this.product && this.product.landing_price || null, [
                Validators.required, Validators.max(90000000), Validators.min(0)
            ]),
            distributor_margin: this.fb.control(this.product && this.product.distributor_margin || null, [
                Validators.required, Validators.max(100), Validators.min(0)
            ]),
            retailer_margin: this.fb.control(this.product && this.product.retailer_margin || null, [
                Validators.required, Validators.max(100), Validators.min(0)
            ]),

            stock: this.fb.control(this.product && this.product.stock || null, [
                Validators.required, Validators.max(90000000), Validators.min(0)
            ]),
            barcode_entry: this.fb.control(this.product && this.product.barcode_entry || null, [
                Validators.required, Validators.maxLength(200)
            ]),
            is_active: [true]
        });
        this.validation_messages = {
            name: [
                {type: 'required', message: 'Name is required.'},
                {type: 'maxlength', message: 'Name cannot be more than 250 characters long.'},
            ],
            category: [
                {type: 'maxlength', message: 'Category cannot be more than 250 characters long.'}
            ],
            price: [
                {type: 'required', message: 'Price is required.'},
                {type: 'max', message: 'Price cannot be more than 90000000.'},
                {type: 'min', message: 'Minimum price is 0.'}
            ],
            landing_price: [
                {type: 'required', message: 'Price is required.'},
                {type: 'max', message: 'Price cannot be more than 90000000.'},
                {type: 'min', message: 'Minimum price is 0.'}
            ],
            distributor_margin: [
                {type: 'required', message: 'Shell Margin is required.'},
                {type: 'max', message: 'Shell Margin cannot be more than 100.'},
                {type: 'min', message: 'Minimum price is 0.'}
            ],
            retailer_margin: [
                {type: 'required', message: 'Retail Margin is required.'},
                {type: 'max', message: 'Retail Margin cannot be more than 100.'},
                {type: 'min', message: 'Minimum price is 0.'}
            ],
            stock: [
                {type: 'required', message: 'Stock is required.'},
                {type: 'max', message: 'Stock cannot be more than 90000000.'},
                {type: 'min', message: 'Minimum price is 0.'}
            ],
            barcode_entry: [
                {type: 'required', message: 'Barcode is required.'},
                {type: 'maxlength', message: 'Barcode cannot be more than 200 characters long.'}
            ],

        };
    }

    private fetchProduct(productId: string) {
        this.initialLoading = true;
        this.productService.getProductById(productId).subscribe(response => {
            this.initialLoading = false;
            this.product = response;
            this.buildForm();
        });
    }


}