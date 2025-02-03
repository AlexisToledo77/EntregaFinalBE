import mongoose from "mongoose"
import { ticketModel } from "../models/ticketModel.js"


export class TicketDAO {
    static async createTicket(ticketData) {
        try {
            const ticket = new ticketModel(ticketData)
            await ticket.save()
            return ticket
        } catch (error) {
            console.error('Error al crear el ticket:', error)
            throw error
        }
    }
}
