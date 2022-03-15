import express from "express";
import indexController from "../component/root";

const route = express.Router();

route.all("/", indexController);

export default route;
