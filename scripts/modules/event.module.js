class EventModule {

    /* initialize static contents */
    /* Important: first function called from module, this function will be called only one time by 'new EventModule();' */
    constructor() {
        this._items = [];
        this._module = 'EventModule';
        this._title = 'Consultas';
        this._activeView = null; //'Create' | 'Map'
        this._activeViewCreate = 'Create';
        this._activeViewMap = 'Map';
        this._counter = 0;
        this._map = null;
        // this._loader = null;
    }

    /* initialize dynamic contents */
    /* called from App.js 'initAllModules' function */
    /* Important: second function called from module, this function will be called only one time */
    init() {
        console.log('** EventModule initialized **')
    }

    /* called by 
        app.js -> routeTo function
        routes.controller.js -> handleRouteChange function 
    */
    /* description: 
        the event 'click' on menu item will trigger this function 
        it will render the content from render function inside 
        #main-content html
        Important: this function will be called everytime the route changes INTO event
    */
    routeInto() {
        console.log('** EventModule on routeInto **');
        console.log(this._map);
        this._counter += 1;

        const content = this.render();
        App.render(content);

        // starts some html available after render
        this.afterRenderInit();
        //demonstrar que eventos são chamados apenas uma vez
        this.bindEvents();

        //get event list from database
        this.getList();
        // this.insertList('name produto', 22, 250);
    }
    /*
        ---- *afterRenderInit --------------------------------------------------------------------------
        Starts some html available after render
        --------------------------------------------------------------------------------------
    */
   afterRenderInit() {
        // this._loader = document.querySelector('.wrap-loader');
   }
    /*
        ---- *bindEvents --------------------------------------------------------------------------
        Creates Event Module events
        --------------------------------------------------------------------------------------
    */
    bindEvents() {
        const item = document.querySelector('.js-on-click-newitem');
        item.addEventListener('click', this.newItem.bind(this));
    }

    showLoader() {
        if (!this._loader) this._loader = document.querySelector('.wrap-loader');
        if (!this._loader) return;
        this._loader.classList.add('active');
    }
    hideLoader() {
        if (!this._loader) return;
        //este setTimeout é apenas para dar tempo de ver o loading
        //caso contrário em localhost ele irá aparecer e sumir muito rápido
        setTimeout(() => {
            this._loader.classList.remove('active');
        }, 1000)
    }

    /*
        --------------------------------------------------------------------------------------
        Função para obter a lista existente do servidor via requisição GET
        --------------------------------------------------------------------------------------
    */
    getList = async () => {
        let url = `${App.Configs._API_BASE_URL}/${App.Configs._API_EVENT_ROUTES.GET_ALL}`
        // let url = 'http://127.0.0.1:5000/events';
        this.showLoader();
        fetch(url, {
          method: 'get',
        })
          .then((response) => response.json())
          .then((data) => {
            this.hideLoader();
            this._items = data.events;

            if (this._activeView === this._activeViewMap)
                this.initGoogleMaps(); //initialize google maps if in 

            this._items.forEach(item => this.insertList(item));
          })
          .catch((error) => {
            console.log('Algum erro ocorreu!');
            console.error('Error:', error);
            this.hideLoader();
          });
    }
    
    /*
        --------------------------------------------------------------------------------------
        Função para colocar um item na lista do servidor via requisição POST
        --------------------------------------------------------------------------------------
    */
    postItem = async (data) => {
        let url = `${App.Configs._API_BASE_URL}/${App.Configs._API_EVENT_ROUTES.POST}`

        const formData = new FormData();
        formData.append('name', data.inputName);
        formData.append('location_name', data.newLocation);
        formData.append('observation', data.newObservation);
        formData.append('doctor_name', data.newDoctor);
        formData.append('date', data.newDate);
    
        // let url = 'http://127.0.0.1:5000/event';
        this.showLoader();
        fetch(url, {
            method: 'post',
            body: formData
        })
        .then(async (response) => {
            this.hideLoader();
            //apliquei o await para conseguir o retorno do response
            //e aplica-lo no front
            //também poderia ser usado o then duas vezes como visto em aula
            const data = await response.json();
            this.insertList(data);
            
            this._items.push(data);
            if (this._activeView === this._activeViewMap) this.initGoogleMaps();
        })
        .catch((error) => {
            this.hideLoader();
            console.error('Error:', error);
        });
    }
    
    
    /*
        --------------------------------------------------------------------------------------
        Função para criar um botão close para cada item da lista
        --------------------------------------------------------------------------------------
    */
    insertButton = (parent) => {
        let span = document.createElement("span");
        let txt = document.createTextNode("\u00D7");
        span.className = "close";
        span.appendChild(txt);
        parent.appendChild(span);
    }
    
    
    /*
        --------------------------------------------------------------------------------------
        Função para remover um item da lista de acordo com o click no botão close
        --------------------------------------------------------------------------------------
    */
    removeElement = () => {
        let close = document.getElementsByClassName("close");
        // var table = document.getElementById('myTable');
        let i;
        for (i = 0; i < close.length; i++) {
            close[i].onclick = (event) => {
                let target = event.target;
                let div = target.parentElement.parentElement;
                // const nomeItem = div.getElementsByTagName('td')[0].innerHTML
                const tdName = div.getElementsByTagName('td')[0];
                const nomeItem = tdName.getElementsByTagName('span')[0].innerHTML
                if (confirm(`Deseja realmente remover o Doutor '${nomeItem}' ?`)) {
                    div.remove();
                    this.showLoader();
                    this.deleteItem(nomeItem)
                    alert("Removido!")
                }
            }
        }
    }
    
    /*
        --------------------------------------------------------------------------------------
        Função para deletar um item da lista do servidor via requisição DELETE
        --------------------------------------------------------------------------------------
    */
    deleteItem = (item) => {
        let url = `${App.Configs._API_BASE_URL}/${App.Configs._API_EVENT_ROUTES.POST}`
        url += '?name=' + item;
        // let url = 'http://127.0.0.1:5000/event?name=' + item;
        fetch(url, {
            method: 'delete'
        })
        .then((response) => {
            this.hideLoader();
            return response.json();
        })
        .catch((error) => {
            this.hideLoader();
            console.error('Error:', error);
        });
    }
    
    /*
        --------------------------------------------------------------------------------------
        Função para adicionar um novo item com name, quantidade e valor 
        --------------------------------------------------------------------------------------
    */
    newItem = () => {
        console.log('new Item called!');
        
        let data = {
            inputName: document.getElementById("newInput").value,
            newLocation: document.getElementById("newLocation").value,
            newDoctor: document.getElementById("newDoctor").value,
            newObservation: document.getElementById("newObservation").value,
            newDate: document.getElementById("newDate").value
        }
         
        if (data.inputName === '') {
            alert("Escreva o nome da consulta, exemplo: Consulta Dermatologista!");
        } else {
            if (confirm(`Tem certeza que deseja adicionar o evento '${data.inputName}' ?`)) {
                this.showLoader();
                this.postItem(data)
                // alert("Item adicionado!")
            }
        }
    }
    
    /*
        --------------------------------------------------------------------------------------
        Função para inserir items na lista apresentada
        --------------------------------------------------------------------------------------
    */
    insertList = ({name, location_name, doctor_name , observation , date}) => {

        // date, description, location_name, doctor_name, name, observation, type, user_id

        date = App.Util.dateFormat(date);

        var item = [name, location_name, doctor_name, observation, date];
        var table = document.getElementById('myTable');

        if (!table) return;

        var row = table.insertRow();
    
        for (var i = 0; i < item.length; i++) {
            var cel = row.insertCell(i);
            cel.innerHTML = `<span id="row-name" class='max-overflow'>${item[i]}</span>`
            // cel.textContent = item[i];
            
        }
        this.insertButton(row.insertCell(-1))
        document.getElementById("newInput").value = "";
        document.getElementById("newLocation").value = "";
        document.getElementById("newDoctor").value = "";
        document.getElementById("newObservation").value = "";
        document.getElementById("newDate").value = "";
    
        this.removeElement()
    }


    /*
        --------------------------------------------------------------------------------------
        Initialize google maps when view map
        todo: 
            create a second column next to the map, displaying the list of items (consultas), 
            allowing the user to click on a item and have it displayed on the map.
            move code to a separate file something like GoogleMapsController.js
        documentation:
            https://developers.google.com/maps/documentation/javascript/examples/event-click-latlng
            https://developers.google.com/maps/documentation/javascript/geocoding?hl=pt-br
        --------------------------------------------------------------------------------------
    */
    initGoogleMaps() {
        try {
            if (!document.getElementById('map')) return console.log('Div #map não foi encontrada.');
            if (typeof(google) === 'undefined') return console.log('Google não foi encontrado.');
            
            // setting addresses
            let addresses = [];
            if (this._items) {
                this._items.forEach((item) => {
                    addresses.push(
                        { 
                            address: item.location_name, 
                            title: item.name,
                            ...item
                        },
                    )
                })
            }

            let addressesLength = addresses.length - 1
            if (addressesLength < 0) return console.log('No addresses found!');

            // Map initialization center to Brazil
            App.EventModule._map = new google.maps.Map(document.getElementById('map'), {
                zoom: 4,
                center: { lat: -14.235004, lng: -51.92528 }  
            });

            // initialization do geocode, responsável por converter
            // endereço em coordenadas
            // https://developers.google.com/maps/documentation/javascript/geocoding?hl=pt-br
            let geocoder = new google.maps.Geocoder();
    
            // Loop em cada endereço para converter eles em lat, long
            // e adicionar ao mapa
            addresses.forEach((location, index) => this.geocode(geocoder, location, index, addressesLength));
        } catch (error) {
            console.log('Um erro foi encontrado!');
            console.log(error);
        }
    }

    geocode(geocoder, location, index, addressesLength) {
        geocoder.geocode({ 'address': location.address }, (results, status) => {
            if (status !== 'OK') return alert('Um erro foi encontrado ao tentar gerar o mapa: ' + status + ' >> Você pode ter cadastrado um endereço inválido!');
            
            //creates marker
            const marker = new google.maps.Marker({
                map: App.EventModule._map,
                position: results[0].geometry.location,
                title: location.title
            });

            // set more info to marker
            const infoWindow = new google.maps.InfoWindow({
                content: `<h4>${location.title}</h4><p>${location.doctor_name} > ${location.address}</p>`
            });

            //creates click listener to show more info to marker
            marker.addListener('click', function() {
                infoWindow.open(App.EventModule._map, marker);
            });

            //center to last address found
            if (index === (addressesLength)) {
                App.EventModule._map.setCenter(results[0].geometry.location);
                App.EventModule._map.setZoom(14);
            }
        });
    }

     /*
        --------------------------------------------------------------------------------------
        all module content returned from here
        --------------------------------------------------------------------------------------
    */
    render() {
        //get html string from event list
        const renderView = (this._activeView === this._activeViewCreate) ? this.renderList() : this.renderMap();
        //get html string from event insert form
        const renderInsertForm = this.renderInsertForm();

        return `
            <div id="${this._module}" class="container animation-fade-in section-content-style">
                ${renderView}
                ${renderInsertForm}
            </div>
        `;
	}

    /* LIST */
    renderList() {
        return `<div class="row">
                    <div class="col-md-12">
                        <h2 class='mb-4'>
                            ${this._title} 
                            <span class='small'>/ cadastro / visited ${this._counter} times.</span>
                        </h2>
                        <!-- Tabela com items existentes -->
                        <section class="items mb-4">
                            <table id="myTable">
                                <tr>
                                    <th class='width-50'>Nome</th>
                                    <th>Localização</th>
                                    <th>Doutor</th>
                                    <th>Observação</th>
                                    <th>Data</th>
                                    <th><img src="https://cdn-icons-png.flaticon.com/512/126/126468.png" width="15px" height="15px"></th>
                                </tr>
                            </table>
                        </section>

                    </div>
                </div>`;
    }

    /* LIST */
    renderMap() {
        return `<div class="row">
                    <div class="col-md-12">
                        <h2 class='mb-4'>
                            ${this._title} 
                            <span class='small'>/ mapa / visited ${this._counter} times.</span>
                        </h2>

                        <div id="map"></div>
                    </div>
                </div>`;
    }

    /* FORM */
    renderInsertForm() {
        return `<!-- Opções para adicionar um novo item -->
                <div class='wrap-loader'>
                    <div>Loading... &nbsp;</div>
                    <div class="uggly-spinner animation-rotate"></div>
                </div>
                <div class='row background-variation-b'>
                    <div class='col-md-12'>
                        <section class="newItem pb-1">
                            <input type="text" id="newInput" required class='input-style width-100' placeholder="Nome da consulta:">
                            <input type="text" id="newLocation" class='input-style' placeholder="Localização:">
                            <input type="text" id="newDoctor" class='input-style' placeholder="Doutor:">
                        </section>
                        <section class="newItem pt-1">
                            <input type="text" id="newObservation" class='input-style width-100 ml-0' placeholder="Observação:">
                            <input type="datetime-local" id="newDate" class='input-style' placeholder="Dia da consulta:">
                            <button class="js-on-click-newitem btn btn-primary">Adicionar</button>
                        </section>
                    </div>
                </div>
                `;

                //tried some react syntax like
                //<button onclick="${(event) => this.newItem() }" class="btn btn-primary">Adicionar</button>
                //but it doesnt work
    }
    
	
    /* called by 
        app.js -> routeTo function
        routes.controller.js -> handleRouteChange function 
    */
    /* description: 
        The event 'click' on menu item will trigger this function.
        Will remove any unnecessary content since another route has been loaded 
        Important: this function will be called everytime the route changes OUT from Event module
    */
    routeOut() {
        this._map = null; //destroys google maps, but not necessary.
        console.log('-- EventModule on routeOut --');
    }

}

App.EventModule = new EventModule();

