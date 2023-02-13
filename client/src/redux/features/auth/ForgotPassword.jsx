import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import Loader from '../../../components/Loader'

import { useForgotPasswordMutation } from './authApiSlice'

import usePersist from '../../../hooks/usePersist'

export const ForgotPassword = () => {

    const userRef = useRef()
    const errRef = useRef()

    const [email, setEmail] = useState('')

    const [errorMsg, setErrorMsg] = useState('')

    const [forgotPassword, { isLoading }] = useForgotPasswordMutation()

    const [persist, setPersist] = usePersist()

    const navigate = useNavigate();
    const dispatch = useDispatch();


    useEffect(() => {
        userRef.current?.focus()
    }, [])

    useEffect(() => {
        setErrorMsg('');
    }, [email])

    let content;

    if (isLoading) {
        content = <Loader />
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await dispatch(forgotPassword({ email })).unwrap()

            setEmail('')

            navigate('/login')
        } catch (err) {
            if (!err.status) {
                setErrorMsg('No Server Response');
            } else if (err.status === 400) {
                setErrorMsg('No user with that email address exists');
            } else if (err.status === 401) {
                setErrorMsg('Unauthorized');
            } else {
                setErrorMsg(err.data?.message);
            }
        }
    }

    const handleEmailInput = (e) => setEmail(e.target.value)

    content = (
        <>
            {/* Check if error then display the UnauthorizedPage banner */}
            {errorMsg && <div className="alert alert-danger" role="alert">{errorMsg}</div>}
            <div>
                <div>
                    <div>
                        <form variant="flush" onSubmit={handleSubmit}>
                            <div className='form-group mb-3'>
                                <label htmlFor='email'>Email*</label>
                                <input
                                    type="email"
                                    placeholder="Enter Email"
                                    className="form-control"
                                    id='email'
                                    name='email'
                                    ref={userRef}
                                    value={email}
                                    onChange={handleEmailInput}
                                    autoComplete='off'
                                    required
                                />
                                <i className="far fa-envelope"></i>
                            </div>
                            <div className="form-group d-flex align-items-center justify-content-between mb-3">

                                <Link to="/login" className="forgot-btn">Log In?</Link>
                                <div className="form-group">
                                    <Link to="/signup" className="forgot-btn">New User?</Link>
                                </div>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary btn-lg">Reset Password</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );

    return content;
}

export default ForgotPassword;