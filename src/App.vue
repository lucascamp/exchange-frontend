<script setup>
import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useApiStore } from "./stores/api"
import { computed, onMounted, watch } from "vue";

const apiStore = useApiStore()

const router = useRouter(); 

onMounted(() => {
  apiStore.getCoins()
})

const isLoggedIn = computed(() => !!localStorage.getItem('token'));
const route = useRoute();

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('name');
  localStorage.removeItem('userId');
  
  router.push({ name: 'login' });
};

watch(isLoggedIn, (newValue) => {
  if (newValue) {
    router.push({ name: 'coins' });  
  } else {
    router.push({ name: 'login' }); 
  }
});
</script>

<template>
  <header>
    <nav>
      <RouterLink
        v-if="isLoggedIn && route.name !== 'login'"
        :to="route.name === 'coins' ? { name: 'listTransactions' } : { name: 'coins' }"
        class="nav-link"
      >
        {{ route.name === 'coins' ? 'Listar Transações' : 'Converter Moeda' }}
      </RouterLink>

      <p v-if="isLoggedIn && apiStore.name && route.name !== 'login'" class="text-white">Olá {{ apiStore.name }}</p>

      <RouterLink v-if="!isLoggedIn && route.name !== 'login'" :to="{ name: 'login' }" class="nav-link">Login</RouterLink>
      <button v-if="isLoggedIn && route.name !== 'login'" @click="logout" class="nav-link">Logout</button>
      
    </nav>
  </header>

  <RouterView />
</template>

<style>
.nav-link {
  color: white;
  margin-right: 10px;
  text-decoration: none;
}

.nav-link:hover {
  text-decoration: underline;
}
</style>
