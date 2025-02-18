import { RequestHandler } from 'express';

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // return next();
  try {
    console.log(req.user?.role);

    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({ success: false, message: 'Not logged in' });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const isAdmin: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized' });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export const isVendor: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user || user.role !== 'vendor') {
      return res
        .status(403)
        .json({ success: false, message: 'Not authorized' });
    }
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}
