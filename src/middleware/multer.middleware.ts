import multer from 'multer';

// memory storage
const storage = multer.memoryStorage();
const multerMiddleware = multer({ storage });

export default multerMiddleware;