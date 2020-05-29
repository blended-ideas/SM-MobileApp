import {Component, Input, OnInit} from '@angular/core';
import {ProductInterface} from '../../interfaces/product.interface';
import {PopoverController} from '@ionic/angular';
import {ProductService} from '../../services/product.service';
import {SessionService} from '../../services/session.service';

@Component({
    selector: 'app-add-expiry-date-pop-over',
    templateUrl: './add-expiry-date-pop-over.component.html',
    styleUrls: ['./add-expiry-date-pop-over.component.scss'],
})
export class AddExpiryDatePopOverComponent implements OnInit {
    @Input() product: ProductInterface;
    expiryDate = new Date().toISOString();
    today = new Date().toISOString();
    maxDate: string;
    isAdding: boolean;

    constructor(private popoverController: PopoverController,
                private productService: ProductService,
                private sessionService: SessionService) {
    }

    ngOnInit() {
        this.maxDate = new Date(new Date().setFullYear(new Date().getFullYear() + 10)).toISOString();
    }

    dismiss(boolValue) {
        this.popoverController.dismiss(boolValue);
    }

    updateExpiryDate() {
        const postObj = {
            user: this.sessionService.user.id,
            product: this.product.id,
            datetime: this.expiryDate
        };
        this.isAdding = true;
        this.productService.postExpiry(postObj).subscribe(response => {
            this.dismiss(true);
            this.isAdding = false;
        }, error => {
            this.isAdding = false;
        });
    }
}
