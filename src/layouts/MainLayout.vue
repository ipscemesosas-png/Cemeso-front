<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Cemeso IPS  </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer 
      v-model="leftDrawerOpen" 
      show-if-above 
      bordered
      elevated
      side="left"
      :mini="miniState"
      @mouseenter="miniState = false"
      @mouseleave="miniState = true"
    >
    <img src="../assets/logoEmpresa.png" alt="Banner" style="width: 100%; height: auto;"/>
      <q-list>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Inicio',
    // caption: 'quasar.dev',
    icon: 'home',
    link: '/#/',
  }
]

const leftDrawerOpen = ref(false)
const miniState = ref(true)


function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
