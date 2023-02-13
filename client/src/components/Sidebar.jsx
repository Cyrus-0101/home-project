import React from 'react'
import { Link } from 'react-router-dom'
import { useSendLogoutMutation } from '../redux/features/auth/authApiSlice';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '../redux/features/auth/authSlice';

const Sidebar = () => {
    const [sendLogout, {
        isLoading,
        isError,
        error,
    }] = useSendLogoutMutation();

    const handleLogOut = () => {
        sendLogout();
        window.location.href = '/'
    };

    const token = useSelector(selectCurrentToken)


    return (
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-light">
            <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-dark min-vh-100" style={{ top: 0, position: "-webkit-sticky", position: "sticky" }}>
                <Link to="/" className="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
                    <span className="fs-5 d-none d-sm-inline">Menu</span>
                </Link>
                <ul className="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start" id="menu">
                    <li className="nav-item">
                        <Link to="/" className="nav-link align-middle px-0">
                            <i className="fs-4 bi-speedometer2"></i> <span className="ms-1 d-none d-sm-inline">Home</span>
                        </Link>
                    </li>

                    {token && (
                        <li className="nav-item">
                            <Link to="/me" className="nav-link align-middle px-0">
                                <i className="fas-4 bi-person-bounding-box"></i> <span className="ms-1 d-none d-sm-inline">Profile</span>
                            </Link>
                        </li>
                    )}

                </ul>
                {token && (
                    <div className="dropdown pb-4">
                        <a href="#" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src="https://github.com/mdo.png" alt="hugenerd" width="30" height="30" className="rounded-circle" />
                            <span className="d-none d-sm-inline mx-1">loser</span>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-dark text-small shadow" aria-labelledby="dropdownUser1">
                            <li><Link className="dropdown-item" href="/me">Profile</Link></li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li><Link className="dropdown-item" onClick={handleLogOut}>Sign out</Link></li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Sidebar