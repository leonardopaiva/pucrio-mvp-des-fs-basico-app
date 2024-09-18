class SpecialtyModule {

    constructor() {
        this._items = [];
        this._module = 'SpecialtyModule';
        this._title = 'Specialties';
        this._counter = 0;
    }

    init() {
        console.log(`** ${this._module} initialized **`)
    }

    routeInto() {
        console.log(`** ${this._module} on routeInto **`);

        this._counter += 1;

        const content = this.render();
        App.render(content);
    }

    render() {
        return `<div id="${this._module}" class="container animation-fade-in section-content-style">
                    <div class="row">
                        <div class="col-md-12">
                            <h2>${this._title}</h2>
                            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed voluptatum minima placeat dolorem tempore pariatur, debitis fuga, dolores repellendus blanditiis laudantium veritatis culpa consequuntur voluptatibus iste iure deleniti. Ratione, corrupti!</p>
                            <p>Visited ${this._counter} times.</p>
                        </div>
                    </div>
                </div>`;
	}

    routeOut() {
        console.log(`-- ${this._module} on routeOut --`);
    }

}

App.SpecialtyModule = new SpecialtyModule();

