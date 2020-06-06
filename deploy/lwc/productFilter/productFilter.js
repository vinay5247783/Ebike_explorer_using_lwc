import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import CATEGORY_FIELD from '@salesforce/schema/Product__c.Category__c';
import LEVEL_FIELD from '@salesforce/schema/Product__c.Level__c';
import MATERIAL_FIELD from '@salesforce/schema/Product__c.Material__c';
import { fireEvent } from 'c/pubsub';

const DELAY = 350;
export default class ProductFilter extends LightningElement {
    searchKey = '';
    maxPrice = 10000;
    filters = {
        searchKey: '',
        maxPrice: 10000
    };
    @wire(CurrentPageReference) pageRef;
    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: CATEGORY_FIELD
    })
    categories;
    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: LEVEL_FIELD
    })
    levels;
    @wire(getPicklistValues, {
        recordTypeId: '012000000000000AAA',
        fieldApiName: MATERIAL_FIELD
    })
    materials;
    handleSearchKeyChange(event) {
        this.filters.searchKey = event.target.value;
        this.delayedFireFilterChangeEvent();
    }
    handleMaxPriceChange(event) {
        const maxPrice = event.target.value;
        this.filters.maxPrice = maxPrice;
        this.delayedFireFilterChangeEvent();
    }
    handleCheckboxChange(event) {
        if (!this.filters.categories) {
            
            this.filters.categories = this.categories.data.values.map(
                item => item.value
            );
            this.filters.levels = this.levels.data.values.map(
                item => item.value
            );
            this.filters.materials = this.materials.data.values.map(
                item => item.value
            );
        }
        const value = event.target.dataset.value;
        const filterArray = this.filters[event.target.dataset.filter];
        if (event.target.checked) {
            if (!filterArray.includes(value)) {
                filterArray.push(value);
            }
        } else {
            this.filters[event.target.dataset.filter] = filterArray.filter(
                item => item !== value
            );
        }
        fireEvent(this.pageRef, 'filterChange', this.filters);
    }

    delayedFireFilterChangeEvent() {
       
        window.clearTimeout(this.delayTimeout);
        
        this.delayTimeout = setTimeout(() => {
            fireEvent(this.pageRef, 'filterChange', this.filters);
        }, DELAY);
    }
}
