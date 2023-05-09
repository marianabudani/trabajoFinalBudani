import multer from "multer"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'piblic/img')
  },
  filename: function (req, file, cb) {
    const date = new Date()
    cb(null, `${date.getTime()}-${req.body.type}-${req.body.name}.png`)
  }
})

export const imgUploader = multer({ storage })