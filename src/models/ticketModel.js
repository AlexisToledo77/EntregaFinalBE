import mongoose from "mongoose"

export const ticketModel=mongoose.model(
    "tickets",
    new mongoose.Schema(
        {
            nroComp: String,
            fecha: Date,
            detalle: [],
            total: Number,
            comprador: String
        },
        {
            timestamps:true
        }
    )
)