import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../store';
import { webRoutes } from './web';
import { RoleEnum } from '@/interfaces/enum/RoleEnum';
 
export type RequireRoleProps = {
    children: JSX.Element;
    allowedRoles?: RoleEnum[];
};

const RequireRole = ({ children, allowedRoles }: RequireRoleProps) => {
    const user = useSelector((state: RootState) => state.admin?.user);

    // If no role restriction, allow access
    if (!allowedRoles || allowedRoles.length === 0) {
        return children;
    }

    // Check if user has required role
    const userRole = user?.role as RoleEnum;
    const hasAccess = allowedRoles.includes(userRole);


    if (!hasAccess) {
        // If user is staff, redirect to their profile page
        if (userRole === RoleEnum.Staff) {
            return <Navigate to={webRoutes.staff.view.replace(':id', String(user?.profil?.id || ''))} replace />;
        }
        // Otherwise, redirect to dashboard or first accessible page
        return <Navigate to={webRoutes.bookings} replace />;
    }

    return children;
};

export default RequireRole;