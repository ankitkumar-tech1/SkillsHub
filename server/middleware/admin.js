/**
 * Admin Middleware
 * 
 * Checks if the authenticated user has the 'admin' role.
 * Must be placed AFTER the authenticate middleware.
 */

const isAdmin = async (req, res, next) => {
    try {
        // Check if user exists and has admin role
        // req.user is set by the authenticate middleware
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        // User is admin, proceed
        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error in admin authorization'
        });
    }
};

module.exports = isAdmin;
