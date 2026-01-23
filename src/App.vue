<script setup>
  import AppMenu from './components/AppMenu.vue';
  import AppAbout from './components/AppAbout.vue';
  import BookForm from './components/BookForm.vue';
  import BooksList from './components/BooksList.vue';

</script>

<template>
  <h1>BATOIBOOKS</h1>
  <AppMenu></AppMenu>
  <BooksList></BooksList>
  <BookForm></BookForm>
  <AppAbout></AppAbout>
</template>

<style scoped></style>
