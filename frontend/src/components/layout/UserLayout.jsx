import Header from "./Header";

import { Outlet }
from "react-router-dom";

function UserLayout() {

    return (

        <>

            <Header />

            <div className="container mt-4">

                <Outlet />

            </div>

        </>

    );
}

export default UserLayout;