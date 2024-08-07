export default class TicketRepository {
    constructor(dao){
        this.dao = dao;
    }

    getTickets = async () => {
        let result = await this.dao.getTickets();
        return result;
    }

    getTicketById = async (id) => {
        let result = await this.dao.getTicketById(id);
        return result;
    }

    createTicket = async (ticket) => {
        let result = await this.dao.createTicket(ticket);
        return result;
    }

    updateTicket = async (id, ticket) => {
        let result = await this.dao.updateTicket(id, ticket);
        return result;
    }
}