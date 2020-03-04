import "./config/env";
import Server from "./config/server";
import routes from "./routes";

const port = parseInt(process.env.PORT);
export default new Server().router(routes).listen(port);
