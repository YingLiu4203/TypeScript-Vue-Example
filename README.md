# typescript-vue-example

> A TypeScript Vue Project Example

Base on the the [Jayway's Vue.js 2.0 workshop](https://jayway.github.io/vue-js-workshop/), this document describes the steps to scaffold a TypeScript Vue project and add more components to create a structure for non-trivial projects.

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

### 1.1. Initialize a Vue Project

Run `vue init webpack typescript-vue-example` to create a new project named `typescript-vue-example`. To make it simple, don't setup ESLint, unit test and e2e tests. 

Run the following commandto see it is up and running at http://localhost:8080/, type `ctrl-C` to exit. 

```sh
cd typescript-vue-example
npm install
npm run dev
```

### 1.2. Use TypeScript Instead of Babel
We use TypeScript go generate all JavaScript ES5 code, therefore there is no need to to use Bable in this project. In `package.json`, remove all lines having a "babel" prefix. 

Then install `typescript` and `ts-loader` packages. `ts-loader` works with `vue-loader` (installed by `vue-cli` in project intialization) to process TypeScript code in a `vue` file. 

```sh
npm i -D typescript
npm i -D ts-loader
```

### 1.3. Config Webpack Loaders
To use the `typescript` and `ts-loader`, we need to configure both TypeScript and Webpack.

### 1.3.1. Config TypeScript
Create a `tsconfig.json` file in the project root folder with the following contents: 

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["es5", "es2015.promise", "dom"]
  }
}
```

In the above file, we set the generate JavaScript code in `es5` syntax. We also need the `es5` and `es2015.promise` libs to compile TypeScript code. 

### 1.3.2. Config Webpack
Edit `build/webpack.base.conf.js` to have the following changes:   

```js
// 1. change the entry to a .ts file
entry: {
  app: './src/main.ts'
},

// 2. add resolve extensions for '.ts'
resolve: {
    extensions: ['', '.js', '.vue', '.ts'],
    // ...
}

// 3. in "module: { loaders: []", replace the "bable loader for js test" to "ts-loader for ts test" 
      {
        test: /\.ts$/,
        loader: 'ts',
        include: projectRoot,
        exclude: /node_modules/
      },

// 4. in "vue: {", set esModule to true,
  vue: {
      loaders: utils.cssLoaders({ sourceMap: useCssSourceMap }),
      // typescript needs it
      esModule: true,
      
      // ... 
  },

// 5. append a ".ts" file to all ".vue" file thus typescript can preprocess the file
  ts: {
    appendTsSuffixTo: [/\.vue$/]
  }
```

## 2. Convert JavaScript Code to TypeScript 
The good news is that Vue npm package comes with type definitions and we can have type checking and editing help. However, the import syntax is different in TypeScript. 

First, Change the `<script>` tag in `src/App.vue` and `src/components/Hello.vue` as `<script lang="ts">` for the `ts-loader` to work. 

Then rename the entry file `src/main.js` as `src/main.ts` and edit it to have the following content: 

```ts
import * as Vue from 'vue'
import App from './App'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
```

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

<script lang="ts">
export default {}
</script>
```

In the above `ProductList.vue` file, though we don't have anything for for the `<script>` section, for TypeScript to work, we let it export an empty object. 

Then change the `App.vue` as the following to use the new product list component.

```ts
<template>
  <product-list></product-list>
</template>

<script lang="ts">
import ProductList from './components/ProductList'

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
To make the project scalable, We use modules to manage the store for different parts of an application. In the `src/store` folder, we define types for all store modules. Each module has a type file. 

### 5.1. Install `vuex`
Run `npm i -S vuex` to install the Vue state store plugin.

### 5.3. Create Type Constants
Create `src/store/products-types.ts` file as the following:

```js
export const GET_PRODUCTS = 'products/GET_PRODUCTS'
```

The reason that we create this file is that there will be a types file for each store module. 

## 5.3. Create the `getProducts` Getter
Create `src/store/modules/products/getters.ts` as the following:

```ts
import { GET_PRODUCTS } from '../../products-types'

export const getters = {
  [GET_PRODUCTS] (state) {
    return state.products
  }
}
```

For a non-trivial project, there will be getters, mutations, and actions and each type will be in one or more file. 

### 5.4 Create the Products Store Module
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
    ...initialState
  },
  getters
}
```

This is the module-levle store file that exposes all module states and methods.
 
### 5.5. Add the Store to the Root Instance
In `src/main.ts`, import the newly created store and add it to the root instance option. After this, all child components can access the store. 

```ts
declare let process: any

import * as Vue from 'vue'
import * as Vuex from 'vuex'

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

This is the root-level store file that exposes all store modules. 

### 5.6. Use the Store in ProductList Component
to get products data from the store using a computed property,  change the content of `<script lang="ts"> </script>` of the `src/components/ProductList.vue` fiel as  the following: 

```ts
<script lang="ts">
import * as Vuex from 'vuex'

import * as types from '../store/products-types'

export default {
  computed: Vuex.mapGetters({
    products: types.GET_PRODUCTS
  })
}
</script>
```

In the above code, we map the `types.GET_PRODUCTS` getter meethod to a local computed property with a name `products`.  

Run `npm run dev` to check that the site is up and running correctly. 
