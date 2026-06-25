import { Navigate } from "react-router-dom";

import { getUserRole } from "../../utils/auth";

function ProtectedAdminRoute({
    children
}) {

    const role = getUserRole();

    if (role !== "ADMIN") {

        return <Navigate to="/" />;
    }

    return children;
}

export default ProtectedAdminRoute;