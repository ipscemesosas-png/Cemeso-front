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
          placeholder="Buscar Empleado..."
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
        :filter="filter"
        class="bg-accent"
        dark
      >
        <template v-slot:body-cell-options="props">
          <q-td class="text-center">
            <q-btn outline rounded icon="delete_forever" @click="eliminarEmpleado(props.row._id)">
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
            <q-btn outline rounded icon="visibility" @click="buscarAusentismo(props.row._id)">
              <q-tooltip>Ver Ausentismo</q-tooltip>
            </q-btn>
            <q-btn outline rounded icon="edit" @click="traerData(props.row)">
              <q-tooltip>Editar Empleado</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
  <q-dialog v-model="modal" persistent transition-show="scale" transition-hide="scale">
    <q-card style="width: 800px; max-width: 100vw">
      <q-card-section>
        <div class="text-h6 text-center text-primary">Datos del empleado</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input label="Nombre del empleado" class="q-ma-md" v-model="nombreEmpleado" outlined />
        <q-input label="cedula" class="q-ma-md" v-model="cedulaEmpleado" outlined />
        <!-- <q-input label="Empresa" class="q-ma-md" v-model="empresaEmpleado" outlined /> -->
        <q-input label="Cargo" class="q-ma-md" v-model="cargoEmpleado" outlined />
        <q-input label="Area" class="q-ma-md" v-model="areaEmpleado" outlined />
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn color="positive" v-if="edit" label="Editar" @click="editEmpleado()" />
        <q-btn color="positive" v-else label="Crear" @click="crearEmpleado()" />
        <q-btn color="primary" label="Cancelar" @click="clean()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useEmpleadosStorage } from 'src/stores/empleadosStorage'
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const useEmpleados = useEmpleadosStorage()

const filter = ref('')

const edit = ref(false)

const idEmpleado = ref('')

const modal = ref(false)

const nombreEmpleado = ref('')
const cedulaEmpleado = ref('')
// const empresaEmpleado = ref('')
const areaEmpleado = ref('')
const cargoEmpleado = ref('')

const columns = ref([
  { name: 'nombre', align: 'center', label: 'Nombre', field: 'nombre' },
  { name: 'cedula', align: 'center', label: 'Cedula', field: 'cedula' },
  { name: 'area', align: 'center', label: 'Area', field: 'area' },
  { name: 'cargo', align: 'center', label: 'Cargo', field: 'cargo' },
  { name: 'options', align: 'center', label: 'Opciones', field: 'options' },
])

const rows = ref([])

const crearEmpleado = async () => {
  await useEmpleados.crearEmpleados({
    empresaId: localStorage.getItem('empresa'),
    nombre: nombreEmpleado.value,
    cedula: cedulaEmpleado.value,
    // empresa: empresaEmpleado.value,
    cargo: cargoEmpleado.value,
    area: areaEmpleado.value,
  })
  modal.value = false
  empleados(localStorage.getItem('empresa'))
}

const editEmpleado = async () => {
  const data = {
    id: idEmpleado.value,
    body: {
      empresaId: localStorage.getItem('empresa'),
      nombre: nombreEmpleado.value,
      cedula: cedulaEmpleado.value,
      // empresa: empresaEmpleado.value,
      cargo: cargoEmpleado.value,
      area: areaEmpleado.value,
    },
  }
  await useEmpleados.editarEmpleados(data)
  modal.value = false
  empleados(localStorage.getItem('empresa'))
}

const clean = () => {
  nombreEmpleado.value = "",
  cedulaEmpleado.value = "",
  cargoEmpleado.value = "",
  areaEmpleado.value = "",

  (modal.value = false)
}

const traerData = (data) => {
  edit.value = true
  idEmpleado.value = data._id
  modal.value = true

  console.log(data)

  nombreEmpleado.value = data.nombre
  cedulaEmpleado.value = data.cedula
  // empresaEmpleado.value = data.empresa
  areaEmpleado.value = data.area
  cargoEmpleado.value = data.cargo
}

const eliminarEmpleado = async (id) => {
  await useEmpleados.eliminarEmpleados(id)
  empleados(localStorage.getItem('empresa'))
}

const empleados = async (empleadoId) => {
  rows.value = await useEmpleados.empleados(empleadoId)
}

const buscarAusentismo = (id) => {
  localStorage.setItem('empleado', id)
  router.push('ausentismo')
}

onBeforeMount(async () => {
  const empleadoId = localStorage.getItem('empresa')

  await empleados(empleadoId)
})
</script>

<style scoped>
.container {
  max-width: 84vw;
  width: 100%;
}
</style>
