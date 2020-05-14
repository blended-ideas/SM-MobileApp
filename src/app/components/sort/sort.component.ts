import {Component, Input, OnInit} from '@angular/core';
import {faSortAlphaUp} from '@fortawesome/free-solid-svg-icons';
import {PopoverController} from '@ionic/angular';

@Component({
    selector: 'app-sort',
    templateUrl: './sort.component.html',
    styleUrls: ['./sort.component.scss'],
})
export class SortComponent implements OnInit {
    @Input() sortValues: [{ name: string, icon: any, value: string }];

    constructor(private popoverController: PopoverController) {
    }

    ngOnInit() {
    }

    async sentSortValue(value) {
        await this.popoverController.dismiss(value);
    }

}
