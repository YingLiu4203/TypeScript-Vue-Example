<template>
  <product-list></product-list>
</template>

<script lang="ts">
declare let require: any

let ProductList = require('./components/ProductList').default

export default {
  name: 'app',
  components: {
    ProductList
  }
}
</script>
