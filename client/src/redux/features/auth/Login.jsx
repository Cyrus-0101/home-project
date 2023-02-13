import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import Loader from '../../../components/Loader'

import { useLoginMutation } from './authApiSlice'
import { setCredentials } from './authSlice'

import usePersist from '../../../hooks/usePersist'

export const Login = () => {

    const userRef = useRef()
    const errRef = useRef()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const [persist, setPersist] = usePersist()

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();

    useEffect(() => {
        userRef.current?.focus()
    }, [])

    useEffect(() => {
        setErrorMsg('');
    }, [email, password])

    let content;

    if (isLoading) {
        content = <Loader />
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { accessToken } = await login({ email, password }).unwrap()

            dispatch(setCredentials({ accessToken }))

            setEmail('')

            setPassword('')

            navigate('/dashboard')
        } catch (err) {
            if (!err.status) {
                setErrorMsg('No Server Response');
            } else if (err.status === 400) {
                setErrorMsg('Missing Email or Password');
            } else if (err.status === 401) {
                setErrorMsg('Unauthorized');
            } else {
                setErrorMsg(err.data?.message);
            }
        }
    }

    const handleEmailInput = (e) => setEmail(e.target.value)
    const handlePasswordInput = (e) => setPassword(e.target.value)
    const handleToggle = () => setPersist(prev => !prev)

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
                            <div className="form-group mb-3">
                                <label htmlFor='password'>Password*</label>
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    className="form-control"
                                    id='password'
                                    name='password'
                                    value={password}
                                    onChange={handlePasswordInput}
                                    autoComplete='off'
                                    required
                                />
                                <i className="fas fa-lock"></i>
                            </div>
                            <div className="form-group d-flex align-items-center justify-content-between mb-3">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        id="persist"
                                        name="persist"
                                        onChange={handleToggle}
                                        checked={persist}
                                    />
                                    <label htmlFor="persist" className="form-check-label">Trust this Device?</label>
                                </div>
                                <Link to="/forgot-password" className="forgot-btn">Forgot Password?</Link>
                                <div className="form-group">
                                    <Link to="/signup" className="forgot-btn">New User?</Link>
                                </div>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary btn-lg">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );

    return content;
}

export default Login;