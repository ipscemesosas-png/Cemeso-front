import { defineStore } from 'pinia'
import { Notify } from 'quasar'
// import { Notify } from 'quasar'
import { api } from 'src/boot/axios'

export const useEmpresaStorage = defineStore(
  'empresa',
  () => {
    const empresaId = ''
    const empresas = async () => {
      try {
        const result = await api.get('empresa/obtener')
        return result.data
      } catch (error) {
        console.log(error)
        return []
      }
    }

    const crearEmpresa = async (data) => {
      try {
        console.log(data)
        Notify.create({
          type: 'positive',
          message: 'Ahora ingrese una imagen/logo de la empresa',
        })
        const result = await api.post(`empresa/crear`, data)
        return result
      } catch (error) {
        console.log(error)
        Notify.create({
          type: 'negative',
          message: 'Error al crear empresa',
        })
        return []
      }
    }

    const eliminarEmpresa = async (id) => {
      console.log('🚀 ~ eliminarEmpresa ~ id:', id)
      try {
        const result = await api.delete(`empresa/eliminar/${id}`)
        Notify.create({
          type: 'positive',
          message: 'Empresa eliminada exitosamente',
        })
        return result
      } catch (error) {
        console.log(error)
        return []
      }
    }

    const editFoto = async (id, image) => {
      try {
        console.log(id, image)

        const result = await api.put(`empresa/editarFoto/${id}`, image)
        Notify.create({
          type: 'positive',
          message: 'Empresa creada exitosamente',
          position: 'top',
        })
        return result
      } catch (error) {
        console.log(error)
        return []
      }
    }
    return {
      empresas,
      empresaId,
      crearEmpresa,
      editFoto,
      eliminarEmpresa,
    }
  },
  {
    persist: {
      storage: localStorage,
      paths: ['empresaId'],
    },
  },
)
