import { Outlet } from 'react-router-dom'

import { memo, useEffect, useState } from 'react'

import { LayoutSh } from '../custom/layout'
import ThemeSwitch from '../theme-switch'
import { TopNav } from '../top-nav'
import SkipToMain from '../skip-to-main'
import Sidebar from '../sidebar'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

const Layout = () => {

  const [isCollapsed, setIsCollapsed] = useIsCollapsed()
  const [OpenModel, setOpenModel] = useState<boolean>(false)
  const store = useSelector((state: RootState) => state?.setting.store)

  useEffect(() => {
    if (store == null) {
      setOpenModel(true)
    }
  }, [])

  const topNav: any = [
    // {
    //   title: 'Overview',
    //   href: 'dashboard/overview',
    //   isActive: true,
    // },
    // {
    //   title: 'Customers',
    //   href: 'dashboard/customers',
    //   isActive: false,
    // },
    // {
    //   title: 'Products',
    //   href: 'dashboard/products',
    //   isActive: false,
    // },
    // {
    //   title: 'Settings',
    //   href: 'dashboard/settings',
    //   isActive: false,
    // },
  ]
  return (
    <div className='relative h-full overflow-hidden bg-background'>
      <SkipToMain />
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id='content'
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? 'md:ml-14' : 'md:ml-64'} h-full`}
      >
        <LayoutSh>
          {/* ===== Top Heading ===== */}
          <LayoutSh.Header>
            <TopNav links={topNav} />
            <div className='ml-auto flex items-center space-x-4'>
              {/* <Search /> */}
              <ThemeSwitch />

            </div>
          </LayoutSh.Header>

          {/* ===== Main ===== */}
          <LayoutSh.Body>

            <Outlet />
          </LayoutSh.Body>
        </LayoutSh>
      </main>
    </div>

  )
}

export default memo(Layout)
