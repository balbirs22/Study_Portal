import mongoose from "mongoose";

const bucket = () => new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
  bucketName: "materials",
});

export const uploadToGridFs = (buffer, { originalname, mimetype }) =>
  new Promise((resolve, reject) => {
    const stream = bucket().openUploadStream(originalname, {
      metadata: { mimetype },
      contentType: mimetype,
    });
    stream.once("error", reject);
    stream.once("finish", () => resolve({
      secure_url: `gridfs://${stream.id}`,
      public_id: String(stream.id),
      original_filename: originalname,
    }));
    stream.end(buffer);
  });

export const streamGridFsFile = (id, res, next) => {
  try {
    return bucket().openDownloadStream(new mongoose.Types.ObjectId(id))
      .once("error", (error) => {
        if (!res.headersSent && error.code === 26) return res.status(404).json({ msg: "The uploaded file could not be found" });
        if (!res.headersSent) next(error);
      })
      .pipe(res);
  } catch (error) {
    if (!res.headersSent) return res.status(400).json({ msg: "Invalid stored file ID" });
  }
};

export const deleteGridFsFile = async (url) => {
  if (!url?.startsWith("gridfs://")) return;
  await bucket().delete(new mongoose.Types.ObjectId(url.slice("gridfs://".length)));
};
