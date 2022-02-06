import express from "express";
import indexController from "@/controller/root.controller";

const route = express.Router();

route.all("/", indexController);

export default route;
