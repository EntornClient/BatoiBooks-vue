<script setup>
  import AppMenu from './components/AppMenu.vue';
  import AppAbout from './components/AppAbout.vue';
  import BooksList from './components/BooksList.vue';

</script>

<template>
  <h1>BATOIBOOKS</h1>
  <nav>
    <router-link to="/form">form</router-link>
  </nav>
  <AppMenu></AppMenu>
  <router-view />
  <BooksList></BooksList>
  <AppAbout></AppAbout>
</template>
<style scoped></style>
