# typescript-vue-example

> A TypeScript Vue Project Example

Base on the [Vue2 + TypeScript2 -- an introductory guide](https://herringtondarkholme.github.io/2016/10/03/vue2-ts2/) and [Jayway's Vue.js 2.0 workshop](https://jayway.github.io/vue-js-workshop/) and , this document descripts the steps to scaffold a TypeScript Vue project and add more components to create a structure for non-trivial projects.

Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

The following are step-by-step instructions to create the project from scracth. 

## 1. Scaffold a Project 
Run `npm install -g vue-cli` to install vue-client. If you already have it, run `npm update -g vue-cli` to update it to the latest version. You may need to use `sudo` to install it as a global package. 

Run `vue init webpack my-project` to create a new project named `my-project`. To make it simple, don't setup ESLint, unit test and e2e tests. 

### 1.1. Use TypeScript Instead of Babel
We use TypeScript go generate all JavaScript ES5 code, therefore there is no need to to use Bable in this project. In `package.json`, remove all lines having a "babel" prefix. 

Then install `typescript` and `vue-ts-loader` packages. Here we use `typescript@rc` for TypeScript 2.1 Release Candidate.  ``vue-ts-loader` works with `vue-loader` to process TypeScript code in a `vue` file. 

```sh
npm i -D typescript@rc
npm i -D vue-ts-loader
npm i
```

### 1.2. Config Webpack Loaders
To use the `typescript` and `vue-ts-loader`, we need to configure both TypeScript and Webpack.

### 1.2.1. Config TypeScript
Create a `tsconfig.json` file in the project root folder with the following contents: 

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "target": "es5",
    "lib": ["es5", "es2015.promise"]
  }
}
```

In the above file, we set the generate JavaScript code in `es5` syntax. We also need the `es5` and `es2015.promise` libs to compile TypeScript code. 

### 1.2.2. Config Webpack
Edit `build/webpack.base.conf.js` to have the following changes:   

```js
// 1. adding this in the top because we use merge later
var merge = require('webpack-merge')

// 2. change the entry to a .ts file
entry: {
  app: './src/main.ts'
},

// 3. add resolve extensions for '.ts'
resolve: {
    extensions: ['', '.js', '.vue', '.ts'],
    // ...
}

// 4. in "module: { loaders: []", change the js and bable loader to ts and vue-ts 
      {
        test: /\.ts$/,
        loader: 'vue-ts',
        include: projectRoot,
        exclude: /node_modules/
      },

// 5. in "vue: {", add js loader and set esModule 
vue: {
    loaders: merge(utils.cssLoaders({ sourceMap: useCssSourceMap }),
      { js: 'vue-ts-loader' }),
    // typescript use esModule
    esModule: true,
      // ... 
}
```

## 2. Convert JavaScript Code to TypeScript 
The good news is that Vue npm package comes with type definitions and we can have type checking and editing help. However, the import syntax is different in TypeScript. 

### 2.1. Change Entry File
Rename the file `src/main.js` as `src/main.ts` and edit it to have the following content: 

```ts
declare let require: any

import Vue = require('vue')
let App = require('./App.vue').default
new Vue({
  el: '#app',
  render: h => h(App)
})
```

### 2.2. Change the Root Component
Edit the `./App.vue` to change its `import` statement as the following: 

```ts
// replace import ProductList from './components/ProductList' 
// with the following statements 
declare let require: any

let Hello = require('./components/Hello').default
```

### 2.3. Run the Project
To verify the changes, run the project with command `npm run dev`. You should see a page served on `http://localhost:8080/` if we make the right changes. 

## 3. Create a Product List Component
Delete the `src/components/Hello.vue` file and create a `src/components/ProductList.vue` file with the following content: 

```html
<template>
  <table class="table table-hover">
     <thead>
      <tr>
        <th>Product Id</th>
        <th>Name</th>
        <th>Description</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="product in products" track-by="id">
        <td>{{product.id}}</td>
        <td>{{product.name}}</td>
        <td>{{product.description}}</td>
        <td>{{product.price}}</td>
      </tr>
    </tbody>
  </table>
</template>
```

Then change the `App.vue` as the following to use the new product list component.

```ts
<template>
  <product-list></product-list>
</template>

<script>
declare let require: any

let ProductList = require('./components/ProductList').default

export default {
  name: 'app',
  components: {
    ProductList
  }
}
</script>
```

Run `npm run dev` to check that the site is up and running correctly. 

## 4. Use BootStrap 4 Styles
We use BootStrap 4 alpha to style the page. We may see the final release in our life time. 

### 4.1. Install BootStrap 4
Run `npm i -S bootstrap@4.0.0-alpha.5` to install BootStrap 4. 

### 4.2. Install `node-saas` and `sass-loader`
Run the following two commands to install `node-sass` and  `sass-loader`. 
```sh
npm i -D node-sass
npm i -D sass-loader
```

### 4.3. Create a Style File with Standard Style
create a `src/styles` folder and create a `style.scss` file with the following content: 
```
@import "../../node_modules/bootstrap/scss/bootstrap-flex.scss";
```

### 4.4. Use the Created Style 
Import the standard bootstrap style by adding the following contents to `main.js`. 

```js
// import some global styles
import './styles/style.scss'
```

Run `npm run dev` to check that the site is up and running correctly. 

## 5. Create a State Store
Run `npm i -S vuex` to install the Vue state store plugin. To make the project scalable, We use modules to manage the store for different parts of an application. In the `src/store` folder, we define types for all store modules. Each module has a type file. 

## 5.1. Create Type Constants
Create `src/store/products-types.ts` file as the following:

```js
export const GET_PRODUCTS = 'products/GET_PRODUCTS'
```

## 5.2. Create the `getProducts` Getter
Create `src/store/modules/products/getters.ts` as the following:

```ts
import { GET_PRODUCTS } from '../../products-types'

export const getters = {
  [GET_PRODUCTS] (state) {
    return state.products
  }
}
```

## 5.3 Create the Products Store Module
Create `src/store/modules/products/index.ts` with the following content: 

```ts
import { getters } from './getters'

const initialState = {
  products: [
    {
      id: '001',
      name: 'COBOL 101 vintage',
      description: 'Learn COBOL with this vintage programming book',
      price: 399,
    },
    {
      id: '007',
      name: 'Sharp C2719 curved TV',
      description: 'Watch TV like with new screen technology',
      price: 1995,
    },
    {
      id: '719',
      name: 'Remmington X mechanical keyboard',
      description: 'Excellent for gaming and typing',
      price: 595,
    }
  ]
}

export default {
  state: {
    products: initialState.products
  },
  getters
}
```

### 5.4. Create the Store with the Products Store Module
Create `src/store/index.ts` as following: 

```ts
declare let require: any
declare let process: any

import Vue = require('vue')
import Vuex = require('vuex')

import products from './modules/products'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    products
  },
  strict: debug
})
```
 
### 5.5. Add the Store to the Root Instance
In `src/main.ts`, import the newly created store and add it to the root instance option. After this, all child components can access the store. 

```ts
declare let require: any

import './styles/style.scss'

import Vue = require('vue')
let App = require('./App.vue').default
import store from './store'

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
```

### 5.6. Use the Store in ProductList Component
Create a `<script> </script>` and add the following content `src/components/ProductList.vue` to get products data from the store using a computed property. 

```ts
declare let require: any
import Vuex = require('vuex')

import * as types from '../store/products-types'

export default {
  computed: Vuex.mapGetters({
    products: types.GET_PRODUCTS
  })
}
```

In the above code, we map the `types.GET_PRODUCTS` getter meethod to a local computed property with a name `products`.  

Run `npm run dev` to check that the site is up and running correctly. 
