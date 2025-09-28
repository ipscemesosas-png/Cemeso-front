<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-lg shadow-4" style="width: 350px; max-width: 90vw">
          <q-card-section class="text-center">
            <div class="text-h5 text-primary">Iniciar Sesión</div>
            <div class="text-subtitle2 text-grey-7">Bienvenido de nuevo</div>
          </q-card-section>

          <q-form @submit="onSubmit" class="q-gutter-md">
            <!-- Usuario -->
            <q-input
              v-model="form.cedula"
              label="Cedula"
              type="cedula"
              outlined
              dense
              :rules="[(val) => !!val || 'La cedula es requerida']"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>

            <!-- Contraseña -->
            <q-input
              v-model="form.password"
              label="Contraseña"
              :type="isPwd ? 'password' : 'text'"
              outlined
              dense
              :rules="[(val) => !!val || 'La contraseña es requerida']"
            >
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <!-- Botón -->
            <q-btn label="Ingresar" type="submit" color="primary" class="full-width" />
          </q-form>

          <q-card-section class="text-center text-grey-7 q-mt-md">
            <div>
              ¿No tienes cuenta?
              <q-btn flat color="primary" label="Regístrate" @click="goRegister" />
            </div>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { Notify } from 'quasar'
import { useUserStorage } from 'src/stores/userStorage'

const userStorage = useUserStorage()


const form = ref({
  cedula: '',
  password: '',
})

const isPwd = ref(true)

const onSubmit = async () => {
  if (!form.value.cedula || !form.value.password) {
    Notify.create({
      type: 'negative',
      message: 'Por favor llena todos los campos',
    })
    return
  }

  // Aquí conectas tu API con Axios o fetch
  // Ejemplo simulado
  if (form.value.cedula && form.value.password) {
    await userStorage.login(form.value)
  }
}

const goRegister = () => {
  // Redirigir a la vista de registro
  // Ejemplo: this.$router.push('/register')
  Notify.create({
    type: 'info',
    message: 'Función de registro en desarrollo',
  })
}
</script>
