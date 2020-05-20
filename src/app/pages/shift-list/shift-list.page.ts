import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {faSortDown, faSortUp, faCalendar, faPlusSquare, faEye, faEdit} from '@fortawesome/free-solid-svg-icons';
import {ShiftDetailInterface} from '../../interfaces/shift.interface';
import {HttpParams} from '@angular/common/http';
import {UtilService} from '../../services/util.service';
import {ShiftService} from '../../services/shift.service';
import {SortComponent} from '../../components/sort/sort.component';
import {PopoverController} from '@ionic/angular';

@Component({
    selector: 'app-shift-list',
    templateUrl: './shift-list.page.html',
    styleUrls: ['./shift-list.page.scss'],
})
export class ShiftListPage implements OnInit {
    searchText: string;
    faPlusSquare = faPlusSquare;
    faEdit = faEdit;
    faEye = faEye;
    faCalendar = faCalendar;
    sortContext: { name: string, icon: any, value: string };

    sortValues = [
        {name: 'Shift End Time', icon: faSortDown, value: '-end_dt'},
        {name: 'Shift End Time', icon: faSortUp, value: 'end_dt'},
    ];
    isLoading: boolean;
    next: string;
    sort: string;
    shifts: ShiftDetailInterface[] = [];
    queryMap: any;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private utilService: UtilService,
                private shiftService: ShiftService,
                private popoverController: PopoverController) {
    }

    ngOnInit() {
        this.fetchShifts(true, null);
    }

    fetchShifts(emptyArray?: boolean, link?: string, infiniteScroll?: any) {
        this.isLoading = true;
        this.utilService.presentLoading('Loading Products...');
        if (emptyArray) {
            this.shifts = [];
        }
        let params = new HttpParams().set('page_size', '2');
        if (this.searchText) {
            params = params.set('search', this.searchText);
        }
        if (this.sort) {
            this.sortContext = this.sortValues.find(sv => sv.value === this.sort);
        }
        this.sortContext = this.sortContext || this.sortValues[0];
        params = params.set('ordering', this.sortContext.value);
        this.shiftService.getShifts(params, link).subscribe(response => {
            this.shifts = this.shifts.concat(response.results);
            this.next = response.next;
            console.log(this.next);
            this.isLoading = false;
            this.utilService.dismissLoading();
            if (infiniteScroll) {
                infiniteScroll.target.complete();
            }
        }, () => {
            this.utilService.dismissLoading();
            this.isLoading = false;
            if (infiniteScroll) {
                infiniteScroll.target.complete();
            }
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
                this.fetchShifts(true);
            }
        });
    }

    doInfiniteScroll(infiniteScroll) {
        this.fetchShifts(false, this.next, infiniteScroll);
    }
}
