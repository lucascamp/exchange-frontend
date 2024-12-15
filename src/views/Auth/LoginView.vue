<script setup>
import { useApiStore } from "../../stores/api"
import { reactive } from "vue";

const apiStore = useApiStore()

const formData = reactive({
    email: '',
    password: ''
})
</script>

<template>
  <main>
    <h1 class="title"> Login </ h1> 
        <form @submit.prevent="
        () => {
            apiStore.login('login', formData)
        }
        "
        class="w-1/2 mx-auto space-y-6">
            <div>
                <input type="text" placeholder="Email" v-model="formData.email"/>
            </div>
            <div>
                <input type="password" placeholder="Password" v-model="formData.password"/>
            </div>
            <div>
                <button class="primary-btn"> Login </button>
            </div>
            <div>
                <p v.if="apiStore.message" class="error"> {{ apiStore.message }}</p>
            </div>
        </form>
  </main>
</template>
