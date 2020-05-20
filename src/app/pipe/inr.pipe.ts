import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'inr'
})
export class InrPipe implements PipeTransform {

    transform(value: any, args?: any): string {
        const currencySymbol = '₹';
        if (isNaN(value)) {
            value = 0;
        }
        return currencySymbol + Number(value).toLocaleString('en-IN', {
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }
}
