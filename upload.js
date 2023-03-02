require("dotenv").config();
const fs = require("fs");
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const { google } = require("googleapis");
const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

const that = (module.exports = {
  setFilePublic: async (fileId) => {
    try {
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });

      const getUrl = await drive.files.get({
        fileId,
        fields: "webViewLink, webContentLink",
      });

      return getUrl;
    } catch (error) {
      console.error(error);
    }
  },
  uploadFile: async (file) => {
    try {
      const { originalname, path } = file;
      const createFile = await drive.files.create({
        resource: {
          name: originalname,
          parents: ["17_50Zi7nobHyvZca-HI174a8alvdmTEp"],
        },
        media: {
          mimeType: file.mimetype,
          body: fs.createReadStream(path),
          fields: "id",
        },
      });
      const fileId = createFile.data.id;
      console.log(createFile.data);
      const getUrl = await that.setFilePublic(fileId);

      return getUrl.data.webViewLink;
    } catch (error) {
      console.log("uploadFile: ", error);
    }
  },
  deleteFile: async (fileId) => {
    try {
      console.log("Delete File:::", fileId);
      const deleteFile = await drive.files.delete({
        fileId: fileId,
      });
      console.log(deleteFile.data, deleteFile.status);
    } catch (error) {
      console.error(error);
    }
  },
});
