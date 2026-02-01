import { Outlet, Link, NavLink } from 'react-router-dom';

const Layout = () => {
    return (
        <div>
            <header>
                <nav className="mt-5">
                    <NavLink className="h4 mt-5 mx-2" to="/">
                        首頁
                    </NavLink>
                    <NavLink className="h4 mt-5 mx-2" to="/login">
                        進入後台
                    </NavLink>
                </nav>
            </header>
            <main>
                <Outlet />
            </main>
            <footer className="mt-5 text-center">
                <p>© 2026 Sam's HomePage</p>
            </footer>
        </div>
    );
};

export default Layout; 