import {Router} from "express";
import TransferController from "../controller/amount";

export const amount = Router();

amount.post("/api/amount/transfer", TransferController.transferAmount);
