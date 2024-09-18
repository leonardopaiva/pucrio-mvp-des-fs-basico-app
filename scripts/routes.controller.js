/*
    --------------------------------------------------------------------------------------
    RoutesController: responsible for changing the active module
    --------------------------------------------------------------------------------------
*/
//Todo: 
//implement route change without change hash, example www.mysite.com/doctor instead of www.mysite.com/#doctor
//implement reload
class RoutesController {

    constructor() {
        this._items = [];
        this._menuItemSelector= '.js-register-navigation';
        this._activeMenuItemClassName = 'active';
    }

    init() {
        console.log('** RoutesController initialized **')
        this.initRouteItems();
        this.bindEvents();
    }

    bindEvents() {
        this._items.forEach(item => {
            item.addEventListener('click', this.handleRouteChange.bind(this));
        });
    }

    // initialize all menu items
    // looking for this._menuItemSelector (.js-register-navigation)
    // the menu items needs to follow some pattern, example:
    // <a href="#home" class="js-register-navigation" data-targetmodule="HomeModule" data-url="#home" data-default="true">
    // data-targetmodule: defines the module that will change to when clicked in home App.Home.routeInto() will be called
    // data-url: defines the hash url to home module
    // data-default: defines home default module if no module found when searching by targetmodule
    
    // data-targetview: optional: one additional parameter that will help the module set the render content, 
    // with that is possible to use EventModule for rendering 2 diferent views, 'Create' and 'Map' 
    initRouteItems() {
        this._items = document.querySelectorAll(this._menuItemSelector);

        let hash = window.location.hash;
        let moduleFound = null;
        let defaultModule = null;

        // search for the module to change into based on hash 
        // if no module found, defaultModule will be used
        this._items.forEach((item) => {
            
            if (hash === item.dataset.url)
                moduleFound = item;
            if (item.dataset.default) {
                defaultModule = item;
            }
        });

        if (!moduleFound) {
            moduleFound = defaultModule;
        }
        
        this.handleRouteChange({currentTarget: moduleFound})
    }

    //change active module
    handleRouteChange(event) {

        if (!event || !event.currentTarget) return console.log('Event not found!');
        const target = event.currentTarget;

        //set active link (added '.active' class to html menu item)
        this.setActiveMenuItemClass(target);

        //set targetModule
        if (!target.dataset.targetmodule)  return console.log('Target module not defined!');
        const module = target.dataset.targetmodule;

        //set targetView
        let view = null;
        if (target.dataset.targetview) 
            view = target.dataset.targetview;

        //change active module
        App.routeTo({
            module,
            view
        });
    }

    //set active link (added '.active' class to html menu item)
    setActiveMenuItemClass(target) {
        var menuItems = document.querySelectorAll(this._menuItemSelector);
        menuItems.forEach((item) => {
            item.classList.remove(this._activeMenuItemClassName);
        })
        target.classList.add(this._activeMenuItemClassName);
    }

}

App.Routes = new RoutesController();

