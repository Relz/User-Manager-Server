import * as cors from "cors";
import * as express from "express";
import * as multer from "multer";
import {config} from "./config";
import * as user_manager from "./routes/user_manager";
const upload: any = multer({ dest: config.uploadDir });

const app: express.Express = express();

app.use(cors());

app.get("/users", user_manager.getUsers);
app.post("/users", upload.single("photo"), user_manager.addUser);
app.put("/users/:id", upload.single("photo"), user_manager.editUser);
app.delete("/users/:id", user_manager.removeUser);

app.get("/upload/:photo", user_manager.getUserPhoto);
app.get("/get_user_data", user_manager.getUserData);

app.listen(config.port, () => {
	console.log(`Express server listening on port ${config.port}`);
});
