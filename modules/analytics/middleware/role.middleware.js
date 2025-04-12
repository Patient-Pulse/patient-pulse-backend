const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    const { user_role } = req;

    if (!user_role || !allowedRoles.includes(user_role)) {
      return res.status(403).json({
        message: "You do not have permission to access this resource",
      });
    }

    next();
  };
};

export default roleMiddleware;
