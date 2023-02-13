import React from 'react'
import 'bootstrap/js/dist/dropdown'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../redux/features/auth/authSlice';
import Loader from './Loader';
import { useSendLogoutMutation } from '../redux/features/auth/authApiSlice';
import useAuth from '../hooks/useAuth';

const Header = () => {

    const [sendLogout, {
        isLoading,
        isError,
        error,
    }] = useSendLogoutMutation();

    const handleLogOut = () => {
        sendLogout();
        window.location.href = '/login'
    };

    const token = useSelector(selectCurrentToken)

    const { username, email } = useAuth();

    let content;

    if (isLoading) {
        content = <Loader />
    }

    if (isError) {
        content = <div className="alert alert-danger" role="alert">{error}</div>
    }

    content = (
        <header className="p-3 mb-3 border-bottom">
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
                    <Link to="/" className="d-flex align-items-center mb-2 mb-lg-0 text-dark text-decoration-none">
                        <h3>Home Interview LLC.</h3>
                    </Link>
                    <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">

                    </ul>
                    <form className="col-12 col-lg-auto mb-3 mb-lg-0 me-lg-3">
                        <input type="search" className="form-control" placeholder="Search..." aria-label="Search" />
                    </form>

                    {token && (
                        <div className="dropdown text-end">
                            <Link to="#" className="d-block link-dark text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                                <img src="https://picsum.photos/200/300" alt={username} width="32" height="32" className="rounded-circle" />&nbsp;{username}
                            </Link>
                            <ul className="dropdown-menu text-small" aria-labelledby="dropdownUser1">
                                <li><Link className="dropdown-item" to="/me">Profile</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><Link className="dropdown-item" onClick={handleLogOut}>Sign out</Link></li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )


    return content;
}

export default Header