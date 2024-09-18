class DoctorModule {

    /* initialize static contents */
    /* Important: first function called from module, this function will be called only one time by 'new DoctorModule();' */
    constructor() {
        this._items = [];
        this._module = 'DoctorModule';
        this._title = 'Doctors';
        this._counter = 0;
        // this._loader = null;
    }

    /* initialize dynamic contents */
    /* called from App.js 'initAllModules' function */
    /* Important: second function called from module, this function will be called only one time */
    init() {
        console.log('** DoctorModule initialized **')
    }

    /* called by 
        app.js -> routeTo function
        routes.controller.js -> handleRouteChange function 
    */
    /* description: 
        the event 'click' on menu item will trigger this function 
        it will render the content from render function inside 
        #main-content html
        Important: this function will be called everytime the route changes INTO doctor
    */
    routeInto() {
        console.log('** DoctorModule on routeInto **');

        this._counter += 1;

        const content = this.render();
        App.render(content);
        

        // starts some html available after render
        this.afterRenderInit();
        //demonstrar que eventos são chamados apenas uma vez
        this.bindEvents();

        //get doctor list from database
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
        Creates Doctor Module events
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
        let url = `${App.Configs._API_BASE_URL}/${App.Configs._API_DOCTOR_ROUTES.GET_ALL}`
        // let url = 'http://127.0.0.1:5000/doctors';
        this.showLoader();
        fetch(url, {
          method: 'get',
        })
          .then((response) => response.json())
          .then((data) => {
            this.hideLoader();
            data.doctors.forEach(item => this.insertList(item));
          })
          .catch((error) => {
            console.error('Error:', error);
            this.hideLoader();
          });
    }
    
    /*
        --------------------------------------------------------------------------------------
        Função para colocar um item na lista do servidor via requisição POST
        --------------------------------------------------------------------------------------
    */
    postItem = async (inputProduct, inputEmail) => {
        let url = `${App.Configs._API_BASE_URL}/${App.Configs._API_DOCTOR_ROUTES.POST}`

        const formData = new FormData();
        formData.append('name', inputProduct);
        formData.append('email', inputEmail);
    
        // let url = 'http://127.0.0.1:5000/doctor';
        this.showLoader();
        fetch(url, {
            method: 'post',
            body: formData
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
                const nomeItem = div.getElementsByTagName('td')[0].innerHTML
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
        let url = `${App.Configs._API_BASE_URL}/${App.Configs._API_DOCTOR_ROUTES.POST}`
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
        let inputName = document.getElementById("newInput").value;
        let inputEmail = document.getElementById("newEmail").value;

        if (inputName === '') {
            alert("Escreva o nome de um item!");
        } else if (!inputEmail.includes('@')) {
            alert("Email invalid! no '@' found!");
        } else {
            if (confirm(`Tem certeza que deseja adicionar o Doutor '${inputName}' ?`)) {
                this.showLoader();
                this.insertList({name: inputName, email: inputEmail})
                this.postItem(inputName, inputEmail)
                // alert("Item adicionado!")
            }
        }
    }
    
    /*
        --------------------------------------------------------------------------------------
        Função para inserir items na lista apresentada
        --------------------------------------------------------------------------------------
    */
    insertList = ({name, email}) => {
        var item = [name, email]
        var table = document.getElementById('myTable');
        var row = table.insertRow();
    
        for (var i = 0; i < item.length; i++) {
            var cel = row.insertCell(i);
            cel.textContent = item[i];
        }
        this.insertButton(row.insertCell(-1))
        document.getElementById("newInput").value = "";
        document.getElementById("newEmail").value = "";
    
        this.removeElement()
    }

     /*
        --------------------------------------------------------------------------------------
        all module content returned from here
        --------------------------------------------------------------------------------------
    */
    render() {
        //get html string from doctor list
        const renderList = this.renderList();
        //get html string from doctor insert form
        const renderInsertForm = this.renderInsertForm();

        return `
            <div id="${this._module}" class="container animation-fade-in section-content-style">
                ${renderList}
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
                            <span class='small'>visited ${this._counter} times.</span>
                        </h2>
                        <!-- Tabela com items existentes -->
                        <section class="items mb-4">
                            <table id="myTable">
                                <tr>
                                    <th class='width-80'>Nome</th>
                                    <th>Email</th>
                                    <th><img src="https://cdn-icons-png.flaticon.com/512/126/126468.png" width="15px" height="15px"></th>
                                </tr>
                            </table>
                        </section>
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
                        <section class="newItem">
                            <input type="text" id="newInput" required class='input-style width-100' placeholder="Adicionar novo doutor:">
                            <input type="text" id="newEmail" class='input-style' placeholder="Email:">
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
        the event 'click' on menu item will trigger this function 
        will remove any unnecessary content since another route has been loaded 
        Important: this function will be called everytime the route changes OUT from doctor
    */
    routeOut() {
        console.log('-- DoctorModule on routeOut --');
    }

}

App.DoctorModule = new DoctorModule();

