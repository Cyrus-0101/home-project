import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

import Loader from '../../../components/Loader'

import { useSignupMutation } from './authApiSlice'
import { setCredentials } from './authSlice'

import usePersist from '../../../hooks/usePersist'

export const Login = () => {

    const userRef = useRef()
    const errRef = useRef()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const [persist, setPersist] = usePersist()

    const navigate = useNavigate();
    const dispatch = useDispatch();


    const [signup, { isLoading }] = useSignupMutation();

    useEffect(() => {
        userRef.current?.focus()
    }, [])


    useEffect(() => {
        setErrorMsg('');
    }, [firstName, lastName, email, password])

    let content;

    if (isLoading) {
        content = <Loader />
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const { accessToken } = await signup({ firstName, lastName, email, password }).unwrap()

            dispatch(setCredentials({ accessToken }))

            setFirstName('')

            setLastName('')

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

    const handleFirstNameInput = (e) => setFirstName(e.target.value)
    const handleLastNameInput = (e) => setLastName(e.target.value)
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
                                <label htmlFor='firstName'>First Name*</label>
                                <input
                                    type="firstName"
                                    placeholder="Enter First Name"
                                    className="form-control"
                                    id='firstName'
                                    name='firstName'
                                    value={firstName}
                                    onChange={handleFirstNameInput}
                                    autoComplete='off'
                                    required
                                />
                                <i className="far fa-envelope"></i>
                            </div>
                            <div className='form-group mb-3'>
                                <label htmlFor='lastName'>LastName*</label>
                                <input
                                    type="lastName"
                                    placeholder="Enter Last Name"
                                    className="form-control"
                                    id='lastName'
                                    name='lastName'
                                    value={lastName}
                                    onChange={handleLastNameInput}
                                    autoComplete='off'
                                    required
                                />
                                <i className="far fa-envelope"></i>
                            </div>
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
                                    <Link to="/login" className="forgot-btn">Existing User?</Link>
                                </div>
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary btn-lg">Sign Up</button>
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