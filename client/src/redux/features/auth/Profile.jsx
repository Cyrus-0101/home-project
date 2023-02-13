import React from 'react'

const Profile = () => {
    return (
        <div className="container-fluid col py-3" style={{ height: "300vh" }}>
            <h3>Left Sidebar with Submenus</h3>
            <p className="lead">
                An example 2-level sidebar with collasible menu items. The menu functions like an "accordion" where only a single
                menu is be open at a time. While the sidebar itself is not toggle-able, it does responsively shrink in width on smaller screens.</p>
            <ul className="list-unstyled">
                <li><h5>Responsive</h5> shrinks in width, hides text labels and collapses to icons only on mobile</li>
            </ul>
        </div>
    )
}

export default Profile