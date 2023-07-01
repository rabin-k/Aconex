import express from "express";
import projectRoutes from "./project";
import documentRouter from "./document"

const Router = express.Router();

Router.use("/project", projectRoutes);
Router.use("/document", documentRouter);

export default Router;
