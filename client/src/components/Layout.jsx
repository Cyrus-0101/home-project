import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

const Layout = () => {
    return (
        <>
            <Header />
            <main>
                <div className='mx-auto d-flex flex-nowrap'>
                    <Sidebar />
                    <Outlet />
                </div>
            </main>
        </>
    )
}

export default Layout