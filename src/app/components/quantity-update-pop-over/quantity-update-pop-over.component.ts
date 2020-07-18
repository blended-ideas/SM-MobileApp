import {Component, Input, OnInit} from '@angular/core';
import {ShiftEntryInterface} from '../../interfaces/shift.interface';
import {ShiftService} from '../../services/shift.service';
import {PopoverController} from '@ionic/angular';

@Component({
    selector: 'app-quantity-update-pop-over',
    templateUrl: './quantity-update-pop-over.component.html',
    styleUrls: ['./quantity-update-pop-over.component.scss'],
})
export class QuantityUpdatePopOverComponent implements OnInit {
    @Input() entry: ShiftEntryInterface;
    isUpdating: boolean;

    constructor(private shiftService: ShiftService,
                private popoverController: PopoverController) {
    }

    ngOnInit() {
    }

    dismiss() {
        this.popoverController.dismiss(false);
    }

    onSave() {
        console.log(this.entry);
        this.isUpdating = true;
        this.shiftService.updateShiftEntry(this.entry.id, this.entry).subscribe(response => {
            this.isUpdating = false;
            this.popoverController.dismiss(response);
        }, () => {
            this.isUpdating = false;
        });
    }

}
