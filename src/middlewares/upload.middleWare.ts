import multer from "multer";

// upload using memoryStorage
const memoryStorage = multer.memoryStorage();
const uploadMemory = multer({ storage: memoryStorage });


// upload using diskStorage
const diskStorage = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            cb(null, "./uploads");
        },
        filename: (req, file, cb) => {
            const imageExtension = file.mimetype.split("/")[1];
            const filename = `${Date.now()}-${Date.now()}.${imageExtension}`;
            const fileUrl = `${process.env.APP_URL}/uploads/${filename}`;
            req.body.fileUrl = fileUrl;
            req.body.file = filename;
            cb(null, filename);
        },
    }
);
const uploadDisk = multer({ storage: diskStorage });

export { uploadMemory, uploadDisk };
