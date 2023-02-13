import { Outlet, useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { useRefreshMutation } from "./authApiSlice"
import { selectCurrentToken } from "./authSlice"

import Loader from "../../../components/Loader"

import usePersist from "../../../hooks/usePersist"

const PersistLogin = () => {

    const [persist] = usePersist()

    const token = useSelector(selectCurrentToken)

    const effectRan = useRef(false)

    const navigate = useNavigate();

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()

    useEffect(() => {

        if (effectRan.current === true || process.env.NODE_ENV !== 'development') { // React 18 Strict Mode

            const verifyRefreshToken = async () => {
                try {
                    await refresh()

                    setTrueSuccess(true)
                }
                catch (err) {
                    console.error(err)
                }
            }

            if (!token && persist) verifyRefreshToken()
        }
        return () => effectRan.current = true

    }, [navigate])

    let content

    if (!persist) { // persist: no
        // Content is equal to OutLet but if not token redirect to login
        if (!token) {
            // Redirect to login approriately without using Navigate/ force page to be rendered is login page
            window.location.href = '/login'

        }
        content = <Outlet />

    } else if (isLoading) { // persist: yes, token: no
        content = <Loader />

    } else if (isError) { //persist: yes, token: no
        content = (
            <div className="alert alert-danger" role="alert">{error?.data?.message}</div>
        )
    } else if (isSuccess && trueSuccess) { //persist: yes, token: yes
        content = <Outlet />

    } else if (token && isUninitialized) { //persist: yes, token: yes
        content = <Outlet />
    }

    return content
}
export default PersistLogin