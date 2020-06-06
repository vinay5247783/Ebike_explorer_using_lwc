import { LightningElement,track } from 'lwc';

export default class PrivateComponent extends LightningElement {
    @track reactivePrivateProp;
    nonReactivePrivateProp;

    changeHandler1(event)
    {
        this.reactivePrivateProp = event.target.value;
    }
    changeHandler2(event)
    {
        this.nonReactivePrivateProp = event.target.value;
    }
}