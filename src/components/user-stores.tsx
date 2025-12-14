 import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
   DropdownMenuItem,
  DropdownMenuLabel,
 
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import { Store } from '@/interfaces/models/admin'
import { setStore } from '@/store/slices/settingSlice'
import { webRoutes } from '@/routes/web'
import { IconBuildingStore } from '@tabler/icons-react'
  

export function UserStores() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const stores = useSelector((state: RootState) => state.admin?.user?.stores)
  const store = useSelector((state: RootState) => state.setting.store)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
           <IconBuildingStore/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm font-medium leading-none'>
              <span className='mb-4'>
                Magasin
              </span>
              <br/>
               {store?.name} ({store?.city?.name})
              </p>
            <p className='text-xs leading-none text-muted-foreground'>
              {/* {store.city?.ville} */}
            </p>
          </div>
        </DropdownMenuLabel>
        {stores?.map((item : Store,index) => {

          return (
            <DropdownMenuItem
            key={index}
            onClick={()=>{
              dispatch(setStore(item))
              navigate(webRoutes.Dashboard)
            }}
            >
              {item.name} ({item.city?.name})
           </DropdownMenuItem>
          )
        })}
    
      
      
         
       
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
