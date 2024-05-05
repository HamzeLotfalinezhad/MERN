const checkRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;

    // admin can do anything
    if (userRole === 'admin') return next();

    // Check if the user role matches any of the specified roles
    if (roles.includes(userRole)) {
      next(); // User has the required role, so allow the request to proceed
    } else {
      return res.status(403).json('User role access denied');
    }
  };
};


export default checkRole;


// const checkRole = (role) => {
//   return (req, res, next) => {
//     if (req.user.role !== role) {
//       return res.status(403).json('User role access denied');
//     }
//     next();
//   };
// };