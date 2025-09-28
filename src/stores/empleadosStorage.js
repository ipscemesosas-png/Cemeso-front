import { defineStore } from 'pinia'
import { Notify } from 'quasar'
// import { Notify } from 'quasar'
import { api } from 'src/boot/axios'

export const useEmpleadosStorage = defineStore(
  'empleado',
  () => {
    const empleados = async (id) => {
      try {
        const result = await api.get(`empleado/listar/${id}`)
        return result.data
      } catch (error) {
        console.log(error)
        return []
      }
    }

    const crearEmpleados = async (data) => {
      try {
        console.log(data)

        const result = await api.post(`empleado/crear`, data)
        Notify.create({
          type: 'positive',
          message: 'Empleado creado exitosamente',
        })
        return result
      } catch (error) {
        console.log(error)
        Notify.create({
          type: 'negative',
          message: 'Error al crear el empleado',
        })
        return []
      }
    }

    const editarEmpleados = async (data) => {
      try {
        console.log(data)

        const result = await api.put(`empleado/actualizar/${data.id}`, data.body)
        Notify.create({
          type: 'positive',
          message: 'Empleado editado exitosamente',
        })
        return result
      } catch (error) {
        console.log(error)
        Notify.create({
          type: 'negative',
          message: 'Error al editar el empleado',
        })
        return []
      }
    }

    const eliminarEmpleados = async (id) => {
      console.log('🚀 ~ eliminarEmpleados ~ id:', id)
      try {
        const result = await api.delete(`empleado/eliminar/${id}`)
        Notify.create({
          type: 'positive',
          message: 'Empleado eliminada exitosamente',
        })
        return result
      } catch (error) {
        console.log(error)

        return []
      }
    }

    return {
      empleados,
      crearEmpleados,
      eliminarEmpleados,
      editarEmpleados,
    }
  },
  {
    persist: {
      storage: localStorage,
      // paths: ['']
    },
  },
)
