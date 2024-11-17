import { mostrarMensaje } from "@/services/redux/Slices/userSlice"
import {useDispatch, useSelector} from "react-redux"

export const useUser = () => {

    const Dispatch = useDispatch()
    const {user} = useSelector((state : any)=> state.user)

    const Mensaje = () => {
        Dispatch(mostrarMensaje("hola soy un nuevo mensaje ;D"))
    }

    return {
        Mensaje,
        user
    }
}