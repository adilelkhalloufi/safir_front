import { webRoutes } from "@/routes/web"
import { logout } from "@/store/slices/adminSlice"
// import { reset } from "@/store/slices/cartSlice"
// import { resetState } from "@/store/slices/settingSlice"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"


export default function Logout() {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(logout())
    // dispatch(reset())
    // dispatch(resetState())
    navigate(webRoutes.home)
  }, [])

  return (
    <div>logout</div>
  )
}
