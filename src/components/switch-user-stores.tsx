import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { FormModalProps, Store } from '@/interfaces/models/admin'
import { setStore } from '@/store/slices/settingSlice'
import { webRoutes } from '@/routes/web'
import { Dialog, DialogContent, DialogHeader } from './ui/dialog'
import { IconBuildingStore } from '@tabler/icons-react'
  

export function SwitchUserStores({open} :FormModalProps) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const stores = useSelector((state: RootState) => state.admin?.user?.stores)
  return (
    <Dialog open={open}>
    <DialogContent className=''>
      <DialogHeader className='font-bold'>
        Selectionner un magasin
      </DialogHeader>
      {stores?.map((item : Store) => {

          return (
            <Button
            variant="ghost"
            onClick={()=>{
              dispatch(setStore(item))
              navigate(webRoutes.Redirect)
            }}
            className='flex items-center justify-start w-full'
            >
            <IconBuildingStore/>    {item.name} ({item.city?.name})
          </Button>
          )
          })}

  
      
    </DialogContent>
  </Dialog>
  )
}
