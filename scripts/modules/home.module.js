class HomeModule {

    /* initialize static contents */
    /* Important: first function called from module, this function will be called only one time by 'new HomeModule();' */
    constructor() {
        this._items = [];
        this._module = 'HomeModule';
        this._title = 'Home';
        this._counter = 0;
    }

    /* initialize dynamic contents */
    /* called from App.js 'initAllModules' function */
    /* Important: second function called from module, this function will be called only one time */
    init() {
        console.log('** HomeModule initialized **')
    }

    /* called by 
        app.js -> routeTo function
        routes.controller.js -> handleRouteChange function 
    */
    /* description: 
        the event 'click' on menu item will trigger this function 
        it will render the content from render function inside 
        #main-content html
        Important: this function will be called everytime the route changes INTO home
    */
    routeInto() {
        console.log('** HomeModule on routeInto **');

        this._counter += 1;

        const content = this.render();
        App.render(content);
    }

    /* description: all module content returned from here */
    render() {
        return `<div id="${this._module}" class="container animation-fade-in section-content-style">
                    <div class="row">
                        <div class="col-md-12">
                            <h2>${this._title}</h2>
                            <p>Este é o MVP (Minimum Viable Product) do aluno Leonardo Souza Paiva - <a href="https://leonardopaiva.com" target="_blank">www.leonardopaiva.com</a> / <a href="https://especializacao.ccec.puc-rio.br/especializacao/desenvolvimento-full-stack" target="_blank">Faculdade Puc Rio - Pós Graduação Desenvolvimento Full Stack.</a></p>
                            <p>O objetivo deste MVP é dar ao usuário uma maneira de organizar suas consultas médicas de forma que ele consiga visualizá-las como listas ou a sua localização no mapa.</p>
                            <p>
                                Links adicionais: <br />
                                github dos projetos<br />
                                video
                            </p>
                            <p><span class='small'> Visited ${this._counter} times.</span></p>
                        </div>
                    </div>
                </div>`;
	}
    
	
    /* called by 
        app.js -> routeTo function
        routes.controller.js -> handleRouteChange function 
    */
    /* description: 
        the event 'click' on menu item will trigger this function 
        will remove any unnecessary content since another route has been loaded 
        Important: this function will be called everytime the route changes OUT from home
    */
    routeOut() {
        console.log('-- HomeModule on routeOut --');
    }

}

App.HomeModule = new HomeModule();

