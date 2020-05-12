import {Component, OnInit} from '@angular/core';
import {SessionService} from '../../services/session.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

    constructor(private sessionService: SessionService) {

    }

    async ngOnInit() {
        console.log(await this.sessionService.isLoggedIn(true));
    }

}
