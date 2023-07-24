// import multer from "multer";
// import path from 'path'
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//         console.log('filename'),
//     cb(null, path.join(__dirname, "../uploads/")); // Use absolute path
//   },
//   filename: (req, file, cb) => {
//         console.log('filename'),
//     cb(null, file.originalname);
//   },
// });
// // const imageFileFilter = (req, file, cb) => {
// //   if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
// //     const error = new Error("You can upload only image files");
// //     error.status = 400;
// //     return cb(error, false);
// //   }
// //   cb(null, true);
// // };

// const upload = multer({ storage:storage});

// console.log("Middleware loaded successfully");

// export default upload;
