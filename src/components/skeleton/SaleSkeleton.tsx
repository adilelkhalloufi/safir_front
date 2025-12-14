import { Skeleton } from 'antd'
import { Separator } from '../ui/separator'

export default function SaleSkeleton() {
  return (
    <>
      <div className='my-4 flex items-end justify-between sm:my-0 sm:items-center'>
        <div className='flex flex-col gap-4 sm:my-4 sm:flex-row'>
          <Skeleton.Input active/>
          <Skeleton.Button active/>
        </div>
        <div className='flex flex-row items-center justify-center gap-4'>
          <Skeleton.Button />
          <Skeleton.Button active/>
        </div>
      </div>
      <Separator className='shadow' />

         <ul className='faded-bottom no-scrollbar grid gap-4 overflow-auto pb-16 pt-4 md:grid-cols-3 lg:grid-cols-4'>
             {Array.from({ length: 16 }).map((_, index) => (
              <li key={index} className='rounded-lg border p-4 hover:shadow-md'>
                <div className='mb-8 flex items-center justify-between'>
                  <div
                    className={`flex size-10 items-center justify-center rounded-lg bg-muted p-2`}
                  >
                     
                  </div>

                  <Skeleton.Button active/>
                </div>
                <div>
                  <Skeleton.Button active/>
                  <Skeleton.Button active />
                </div>
              </li>
            ))}
        
        </ul>
     
    </>
  )
}
