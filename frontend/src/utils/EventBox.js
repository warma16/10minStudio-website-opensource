class EventBox{
    constructor(){
        this.id=`eventbox-${this.GenerateBoxId()}`;
    }
    GenerateBoxId(){
        //id like 3gagsya62h1bzyzzbzbz5a4a8q2jqg56
        let id = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for(let i=0; i<10; i++){
            id += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return id;
    }
    emit(eventName, eventData){
        window.dispatchEvent(new CustomEvent(`${this.id}-${eventName}`, {detail: eventData, bubbles: true, cancelable: true}));
    }
    on(eventName, callback){
        window.addEventListener(`${this.id}-${eventName}`, (d)=>{
            callback(d.detail);
        });
    }
}