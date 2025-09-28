<template>
  <q-page class="flex flex-center">
    <div class="container">
      <div class="flex flex-center row items-center q-gutter-sm q-ma-xs">
        <q-input
          v-model="filter"
          outlined
          rounded
          dense
          debounce="300"
          placeholder="Buscar Empresa..."
          clearable
          prefix="🔍"
          bg-color="white"
          input-class="text-primary"
          class="col-12 col-sm-8"
        />
        <q-btn
          label="crear"
          icon="add"
          color="primary"
          unelevated
          class="col-auto"
          @click="modal = true"
        />
      </div>
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="name"
        selection="multiple"
        :filter="filter"
        :rows-per-page-options="[8, 16, 32, 64]"
        grid
        hide-header
        dark
      >
        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition">
            <q-card
              flat
              bordered
              class="q-ma-xs bg-accent my-card hover-card"
            >
              <q-img
                :src="props.row.foto"
                style="width: 100%; height: 250px; object-fit: contain; background: #f5f5f5"
              />
              <q-card-section>
                <div class="text-h6">{{ props.row.nombre }}</div>
                <div class="text-subtitle2">{{ props.row.contextoEmpresa }}</div>
                <div class="text-center">
                  <q-btn color="secondary" class="q-ma-xs" @click="buscarEmpleados(props.row._id)">Ver Empresa</q-btn>
                  <q-btn color="secondary" class="q-ma-xs" @click="eliminarEmpresas(props.row._id)">eliminar</q-btn>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </template>
        <template v-slot:no-data>
          <div class="full-width row flex-center q-pa-lg text-accent">
            <q-icon name="inventory_2" size="md" class="q-mr-sm" />
            No hay empresas
          </div>
        </template>
      </q-table>
    </div>
  </q-page>
  <q-dialog v-model="modal" persistent transition-show="scale" transition-hide="scale">
    <q-card style="width: 800px; max-width: 100vw">
      <q-card-section>
        <div class="text-h6 text-center text-primary">Datos de la empresa</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input label="Nombre de la empresa" class="q-ma-md" v-model="nombre" outlined />
        <q-input
          label="Contexto de la empresa"
          class="q-ma-md"
          v-model="contextoEmpresa"
          outlined
        />
        <q-input label="departamento" class="q-ma-md" v-model="departamento" outlined />
        <q-input label="ciudad" class="q-ma-md" v-model="ciudad" outlined />
        <input
          type="file"
          label="Logo de la empresa"
          class="q-ma-md"
          outlined
          v-if="companyCreate == true"
          accept="image/"
          @change="subir"
        />
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn color="positive" v-if="companyCreate" label="Subir Imagen" />
        <q-btn color="positive" v-else label="Crear" @click="crearEmpresa()" />
        <q-btn color="primary" label="Cancelar" @click="modal = false" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useEmpresaStorage } from 'src/stores/empresaStorage'
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const useEmpresas = useEmpresaStorage()

const filter = ref('')

const modal = ref(false)

const nombre = ref('')
const contextoEmpresa = ref('')
const departamento = ref('')
const ciudad = ref('')
const foto = ref(null)

const companyCreate = ref(false)

let companyId = ref('')

const columns = ref([
  { name: 'nombre', align: 'center', label: 'Nombre', field: 'nombre' },
  { name: 'contextoEmpresa', align: 'center', label: 'Informacion', field: 'contextoEmpresa' },
])

const rows = ref([])

const subir = async (e) => {
  foto.value = e.target.files[0]
  console.log('🚀 ~ subir ~ foto.value:', foto.value)
  if (!foto.value) return

  const fd = new FormData()
  fd.append('file', foto.value)
  console.log('🚀 ~ subir ~ fd:', fd)
  await useEmpresas.editFoto(companyId.value, fd)
  clean()
}

const eliminarEmpresas = async (id) =>{
  await useEmpresas.eliminarEmpresa(id)
  await empresas()
}

const clean = () => {
  nombre.value = ''
  contextoEmpresa.value = ''
  departamento.value = ''
  ciudad.value = ''
  foto.value = null

  modal.value = false
}

const crearEmpresa = async () => {
  const data = await useEmpresas.crearEmpresa({
    empresaId: localStorage.getItem('empresa'),
    nombre: nombre.value,
    contextoEmpresa: contextoEmpresa.value,
    departamento: departamento.value,
    ciudad: ciudad.value,
    foto: foto.value,
  })
  if (data.length !== 0) {
    companyId.value = data.data._id
    companyCreate.value = true
  }

}

const empresas = async () => {
  rows.value = await useEmpresas.empresas()
}

const buscarEmpleados = (id) => {
  useEmpresas.empresaId = id
  localStorage.setItem('empresa', id)
  router.push('home/empleados')
}

onBeforeMount(async () => {
  await empresas()
})
</script>

<style scoped>
.container {
  max-width: 84vw;
  width: 100%;
}

.my-card {
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}
.hover-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
}
</style>
