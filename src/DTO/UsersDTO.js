export class UsersDTO {
    constructor(users) {
        this.users = users.map(user => ({
            Id: user._id,
            Nombre: user.first_name,
            Apellido: user.last_name,
            Email: user.email,
            Edad: user.age,
            Rol: user.role
        }))
    }
}
