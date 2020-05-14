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
    shifts: ShiftDetailInterface[] = [];

    constructor(private router: Router,
                private route: ActivatedRoute,
                private utilService: UtilService,
                private shiftService: ShiftService,
                private popoverController: PopoverController) {
    }

    ngOnInit() {
        this.route.queryParamMap.subscribe(queryParamMap => {
            this.fetchShifts(true, null, queryParamMap);
        });
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

    fetchShifts(emptyArray?: boolean, link?: string, queryParamMap?: ParamMap, infiniteScroll?: any) {
        this.isLoading = true;
        this.utilService.presentLoading('Loading Products...');
        if (emptyArray) {
            this.shifts = [];
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
        this.shiftService.getShifts(params, link).subscribe(response => {
            this.shifts = response.results;
            console.log(this.shifts);
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
