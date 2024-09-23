import env from 'dotenv'
export default class usersDTO {
    constructor(first_name, last_name, email, password, age) {
        this.first_name = first_name.toUpperCase();
        this.last_name = last_name.toUpperCase();
        this.email = email
        this.password = password
        this.age = age
        this.isAdmin = this.verifyIsAdmin()

    }
        
    verifyIsAdmin(){
        if (this.email===`${process.env.ADMIN_MAIL}` && this.password===`${process.env.ADMIN_PASSWORD}`){	
            return true
        }else{
            return false
        }
    }
}