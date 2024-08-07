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
        if (this.email==="admin@coder.com" && this.password==="Cod3r123"){
            return true
        }else{
            return false
        }
    }
}