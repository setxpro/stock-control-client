# Control Stock

[https://primeng.org/installation]

npm install primeng

- angular.json

```

  "styles": [
    "node_modules/primeng/resources/themes/lara-light-blue/theme.css",
    "node_modules/primeng/resources/primeng.min.css",
    ...
]

```

style.css

```
  @import "primeng/resources/themes/lara-light-blue/theme.css";
  @import "primeng/resources/primeng.css";
```
@import "primeicons/primeicons.css";

npm install primeng --legacy-peer-deps
npm install primeicons --legacy-peer-deps
npm install primeflex --legacy-peer-deps


###############################################

npm install primeng --force
# ou
npm install primeng --legacy-peer-deps


"dependencies": {
    "@angular/common": "^17.0.0",
    // ... outras dependências ...
}

###############################################

# Angular cookie service
ngx-cookie-service

## Installation

```
npm install ngx-cookie-service --save

# or

yarn add ngx-cookie-service
```

## Usage

Add the cookie service to your app.module.ts as a provider:

```
import {CookieService} from 'ngx-cookie-service';

@NgModule({
  ...
    providers:
[CookieService],
...
})

export class AppModule {
}
```

Then, import and inject it into a constructor:

```
constructor(private
cookieService: CookieService
)
{
  this.cookieService.set('Test', 'Hello World');
  this.cookieValue = this.cookieService.get('Test');
}
```
That's it!


## Create Module...


ng g m dashboard


## CHART JS from Primeng

npm install chart.js --save

"scripts": [
              "node_modules/chart.js/dist/chart.js"
            ] 








## @Input() 
`Forma de compartilhar os dados do component pai para o filho.`

`No caso o component filho declara o @Input() e recebe esse valor atraves do`

`[Property-Bind]="atributo_do_component_pai" => com os dados que deseja compartilhar`

## @Output()

`Permite emitir dados do component filho para o pai`
`<app-input-output (deleteRequest)="crossOfftem($event)"></app-input-output>`

`(deleteRequest)="crossOfftem($event)"` - Espera receber uma função que fica no component pai que espera receber um evento

`$event` - valor emitido no output para o component pai
