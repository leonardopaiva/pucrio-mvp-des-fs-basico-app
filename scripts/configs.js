class ConfigsController {
    constructor() {
		this._API_BASE_URL = 'http://127.0.0.1:5000';
		this._API_DOCTOR_ROUTES = {
            GET_ALL: 'doctors',
            GET: 'doctor',
            POST: 'doctor'
        }
		
    this._API_EVENT_ROUTES = {
            GET_ALL: 'events',
            GET: 'event',
            POST: 'event'
        }
	}

}

App.Configs = new ConfigsController();

