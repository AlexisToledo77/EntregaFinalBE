import { TicketDAO } from "../dao/ticketDAO.js"

export class TicketController {
    static async generateTicket(
        nroComp,
        fecha,
        detalle,
        total,
        comprador
    ) {
        try {
            const ticketData = {
                nroComp,
                fecha,
                detalle,
                total,
                comprador
            }

            const ticket = await TicketDAO.createTicket(ticketData)
            return ticket
        } catch (error) {
            console.error('Error al generar el ticket:', error)
            throw error
        }
    }
}