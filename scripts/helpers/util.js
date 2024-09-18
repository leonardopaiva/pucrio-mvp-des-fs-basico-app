/*
    --------------------------------------------------------------------------------------
    UtilController: define some helper functions
    --------------------------------------------------------------------------------------
*/
class UtilController {

    constructor() {
    }

    init() {
        console.log('** UtilController initialized **')
    }    

    dateFormat(date) {
        if (!date) return console.log('Not valid date!');

        date = new Date(date);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        let formatedDate = `${day}/${month}/${year}`;

        return formatedDate;
    }
}

App.Util = new UtilController();

