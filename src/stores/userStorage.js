import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { api } from 'src/boot/axios'
import { useRouter } from 'vue-router'


export const useUserStorage = defineStore('user', () => {
    const router= useRouter()
  const login = async (data) => {
    try {
      const response = await api.post('usuario/login', data)
      Notify.create({
        type: 'positive',
        message: 'Ingreso Exitoso 🎉',
      })
      router.push('/home')
      return response
    } catch (error) {
      console.log(error)
      Notify.create({
        type: 'negative',
        message: error.response.data.msg,
      })
    }
  }
  return {
    login,
  }
},{
    persist:true
})
