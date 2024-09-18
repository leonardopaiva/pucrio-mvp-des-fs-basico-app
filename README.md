# Meu Front

Este pequeno projeto faz parte do material diático da Disciplina **Desenvolvimento Full Stack Básico** 

O objetivo aqui é ilutsrar o conteúdo apresentado na terceira aula.

---
## Como executar

Basta fazer o download do projeto e abrir o arquivo index.html no seu browser.

## About Project

/* 
	MVP - PUCRS
*/

# MVP Overview

The purpose of this app is to allow the user to register medical appointments and view them on a map or in list format.  
  
In this MVP, a structure based on the **Singleton Design Pattern** was used. For more details, you can refer ao [SSP Simple Singleton Pattern](https://github.com/simplesingleton/SSP-simple-singleton-pattern).

The function **`initAllModules`** is responsible for starting all the app modules that are registered using the singleton. It is important to note that SSP should be considered a design pattern; the only function I used was a modified version of **`initAllModules`**. This distinction is relevant because the project has a requirement not to use libraries, and SSP should not be seen as a library but as an idea for structuring the project.  

## Module Initialization

When **`App.init()`** is called, every initialization function for each module is executed, such as **`App.Doctor.init()`** and **`App.Event.init()`**. This approach allows for a similar application of lifecycle hooks found in frameworks like Angular or React, such as **`ngOnInit`** and **`ngOnDestroy`** for Angular, or **`constructor`** and **`componentWillUnmount`** for React.

## Acknowledgments

I learned this concept in college from Professor Dennis Calazans (Marista College, Internet System), and I would like to express my gratitude to him. Based on this concept, I also developed some interesting functionalities in this app, including:

- **`App.Doctor.routeInto()`**
- **`App.Doctor.render()`**
- **`App.Doctor.routeOut()`**
- **`App.Routes.handleRouteChange()`**

These functions were created to enhance the app experience similarly to what I do with Angular or React, all while meeting the challenge of implementing this MVP using only JavaScript, without including any libraries.

## External Libraries

The project utilizes Google APIs, specifically for visualizing queries on a map. To ensure the map functions correctly, an API key needs to be provided in the script call in **`index.html`**:

```html
<script src="https://maps.googleapis.com/maps/api/js?callback=initGoogleMaps&key=YOUR_API_KEY=places" async defer></script>
```

## API Key and Configuration

This **API KEY** will be provided to teachers along with the GitHub links upon submission of the MVP on the PUCRS platform. However, it can also be generated via the [Google Cloud Console](https://cloud.google.com/cloud-console).

### API Base URL

The base URL for the API is set as follows:

```javascript
this._API_BASE_URL = 'http://127.0.0.1:5000';
```
if your api base url is diferente go to configs.js and change it.

## About This Project

This is the first MVP of the Full Stack Development Postgraduate Program at PUCRS University, Rio de Janeiro.

**Student**: Leonardo Souza Paiva  
**Portfolio**: [www.leonardopaiva.com](http://www.leonardopaiva.com)  
**API URL pucrio-mvp-des-fs-basico-api**: [API URL](https://github.com/leonardopaiva/pucrio-mvp-des-fs-basico-api)