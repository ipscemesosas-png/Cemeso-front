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
          placeholder="Buscar ..."
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
            <q-btn outline rounded icon="delete_forever" @click="eliminarAusentismo(props.row._id)">
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
            <q-btn outline rounded icon="edit" @click="traerData(props.row)">
              <q-tooltip>Editar Empleado</q-tooltip>
            </q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-inicioIncapacidad="props">
          <q-td class="text-center">
            {{ props.row.inicioIncapacidad.slice(0, 10) }}
          </q-td>
        </template>
        <template v-slot:body-cell-finIncapacidad="props">
          <q-td class="text-center">
            {{ props.row.finIncapacidad.slice(0, 10) }}
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
  <q-dialog v-model="modal" persistent transition-show="scale" transition-hide="scale">
    <q-card style="width: 800px; max-width: 100vw">
      <q-card-section>
        <div class="text-h6 text-center text-primary">Datos del ausentismo</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input label="tipo Evento" class="q-ma-md" v-model="tipoAusentismo" outlined />
        <q-input
          type="date"
          label="Inicio Incapacidad"
          class="q-ma-md"
          v-model="inicioAusentismo"
          outlined
        />
        <q-input
          type="date"
          label="Fin Incapacidad"
          class="q-ma-md"
          v-model="finAusentismo"
          outlined
        />
        <q-input label="Prorroga" class="q-ma-md" v-model="prorrogaAusentismo" outlined />
        <q-select
          use-input
          hide-selected
          fill-input
          input-debounce="0"
          outlined
          class="q-ma-md"
          v-model="selected"
          :options="filteredOptions"
          option-value="value"
          option-label="label"
          emit-value
          map-options
          label="Ingrese el codigo/descripcion"
          @filter="filterFn"
        />
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn color="positive" v-if="edit" label="Editar" @click="editAusentismo()" />
        <q-btn color="positive" v-else label="Crear" @click="crearAusentismo()" />
        <q-btn color="primary" label="Cancelar" @click="clean()" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useAusentismoStorage } from 'src/stores/ausentismoStorage'
import { onBeforeMount, ref } from 'vue'

const useAusentismo = useAusentismoStorage()

const filter = ref('')

const modal = ref(false)

const edit = ref(false)

const idAusentismo = ref('')

let codes = []

const selected = ref(null)
const filteredOptions = ref([])

const tipoAusentismo = ref('')
const inicioAusentismo = ref('')
const finAusentismo = ref('')
const prorrogaAusentismo = ref('')

const columns = ref([
  { name: 'mesName', align: 'center', label: 'Mes', field: 'mesName' },
  { name: 'tipoDeEvento', align: 'center', label: 'tipo de Evento', field: 'tipoDeEvento' },
  {
    name: 'inicioIncapacidad',
    align: 'center',
    label: 'Inicio Incapacidad',
    field: 'inicioIncapacidad',
  },
  { name: 'finIncapacidad', align: 'center', label: 'Fin Incapacidad', field: 'finIncapacidad' },
  { name: 'diasIncapacidad', align: 'center', label: 'Dias Incapacidad', field: 'diasIncapacidad' },
  { name: 'prorroga', align: 'center', label: 'Prorroga', field: 'prorroga' },
  {
    name: 'codigoDiagnostico',
    align: 'center',
    label: 'Codigo Diagnostico',
    field: 'codigoDiagnostico',
  },
  {
    name: 'descripcionIncapacidad',
    align: 'center',
    label: 'Descripcion Incapacidad',
    field: 'descripcionIncapacidad',
  },
  { name: 'options', align: 'center', label: 'Opciones', field: 'options' },
])

const rows = ref([])

const crearAusentismo = async () => {
  console.log(selected.value)

  await useAusentismo.crearAusentismo({
    empleadoId: localStorage.getItem('empleado'),
    tipoDeEvento: tipoAusentismo.value,
    inicioIncapacidad: inicioAusentismo.value,
    finIncapacidad: finAusentismo.value,
    prorroga: prorrogaAusentismo.value,
    codigoDiagnostico: selected.value.codigo,
    descripcionIncapacidad: selected.value.descripcion,
  })
  modal.value = false
  ausentismo(localStorage.getItem('empleado'))
}

const eliminarAusentismo = async (id) => {
  await useAusentismo.eliminarEmpleados(id)
  ausentismo(localStorage.getItem('empleado'))
}

const traerData = (data) => {
  edit.value = true
  idAusentismo.value = data._id
  modal.value = true

  tipoAusentismo.value = data.tipoDeEvento
  inicioAusentismo.value = data.inicioIncapacidad.slice(0, 10)
  finAusentismo.value = data.finIncapacidad.slice(0, 10)
  prorrogaAusentismo.value = data.prorroga

  const option = codes.find(
    (opt) =>
      opt.value.codigo === data.codigoDiagnostico &&
      opt.value.descripcion === data.descripcionIncapacidad
  )

  selected.value = option ? option.value : null
}

const editAusentismo = async () => {
  const data = {
    id: idAusentismo.value,
    body: {
      tipoDeEvento: tipoAusentismo.value,
      inicioIncapacidad: inicioAusentismo.value,
      finIncapacidad: finAusentismo.value,
      prorroga: prorrogaAusentismo.value,
      codigoDiagnostico: selected.value.codigo,
      descripcionIncapacidad: selected.value.descripcion,
    },
  }
  await useAusentismo.editarAusentismo(data)
  modal.value = false
  ausentismo(localStorage.getItem('empleado'))
}

const clean = () => {
  tipoAusentismo.value = ''
  inicioAusentismo.value = ''
  finAusentismo.value = ''
  prorrogaAusentismo.value = ''
  selected.value = null       // 👈 QSelect se vacía
  modal.value = false
}

const ausentismo = async (empleadoId) => {
  rows.value = await useAusentismo.Ausentismo(empleadoId)
}

function filterFn(val, update) {
  update(() => {
    const needle = val.toLowerCase()
    filteredOptions.value = codes.filter((opt) => opt.label.toLowerCase().includes(needle))
  })
}

onBeforeMount(async () => {
  const empleadoId = localStorage.getItem('empleado')
  const data = await useAusentismo.traerCodigos()
  codes = data.map((code) => ({
    label: `${code.codigo} - ${code.descripcion}`, // lo que se muestra
    value: code, // guarda el objeto completo en selected
  }))
  filteredOptions.value = codes
  await ausentismo(empleadoId)
})
</script>

<style scoped>
.container {
  max-width: 84vw;
  width: 100%;
}
</style>
