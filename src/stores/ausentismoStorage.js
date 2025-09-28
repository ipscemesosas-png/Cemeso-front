import { defineStore } from 'pinia'
import { Notify } from 'quasar'
// import { Notify } from 'quasar'
import { api } from 'src/boot/axios'

export const useAusentismoStorage = defineStore(
  'ausentismo',
  () => {
    const Ausentismo = async (id) => {
      try {
        const result = await api.get(`ausentismo/listarEmpleado/${id}`)
        return result.data
      } catch (error) {
        console.log(error)
        return []
      }
    }

    const traerCodigos = async () => {
      try {
        const result = await api.get('ausentismo/traerCodigos')
        return result.data
      } catch (error) {
        console.log(error)
        return []
      }
    }

    const crearAusentismo = async (data) => {
      try {
        console.log(data)

        const result = await api.post(`ausentismo/crear`, data)
        Notify.create({
          type: 'positive',
          message: 'Ausentismo agregado exitosamente',
        })
        return result
      } catch (error) {
        console.log(error)
        Notify.create({
          type: 'negative',
          message: 'Error al agregar el Ausentismo',
        })
        return []
      }
    }

    const editarAusentismo = async (data) => {
      try {
        console.log(data)

        const result = await api.put(`ausentismo/actualizar/${data.id}`, data.body)
        Notify.create({
          type: 'positive',
          message: 'Ausentismo editado exitosamente',
        })
        return result
      } catch (error) {
        console.log(error)
        Notify.create({
          type: 'negative',
          message: 'Error al editar el Ausentismo',
        })
        return []
      }
    }

    const eliminarAusentismo = async (id) => {
      console.log('🚀 ~ eliminarAusentismo ~ id:', id)
      try {
        const result = await api.delete(`ausentismo/eliminar/${id}`)
        Notify.create({
          type: 'positive',
          message: 'Ausentismo eliminada exitosamente',
        })
        return result
      } catch (error) {
        console.log(error)
        return []
      }
    }

    return {
      Ausentismo,
      crearAusentismo,
      eliminarAusentismo,
      traerCodigos,
      editarAusentismo,
    }
  },
  {
    persist: {
      storage: localStorage,
      // paths: ['']
    },
  },
)
