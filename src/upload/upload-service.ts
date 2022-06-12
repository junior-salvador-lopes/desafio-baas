import * as fs from "fs";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const id = req.params;
    const pathToSave = `./public/${id.id}`;
    if (!fs.existsSync(pathToSave)) {
      fs.mkdirSync(pathToSave);
    }
    cb(null, pathToSave);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const uploads = multer({
  storage: storage,
});
export default uploads;
