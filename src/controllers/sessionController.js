export const register = async (req, res) => {
    res.redirect("/")
}

export const failregister = async (req, res) => {
    console.log("Usuario ya registrado");
    res.send({error:"upsi dupsy, usuario ya registrado"})
}

export const login = async (req, res) => {
    if (!req.user) return res.status(404).send({status: "error",error : "Datos incompletos"});
        try{
            req.session.user = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                cartId: req.user.cartId,
                isAdmin: req.user.isAdmin
               };
            res.redirect('/current')
        } catch(error) {
            res.status(500).send({message: "Error al buscar el usuario"});
        }
}

export const faillogin = async (req, res) => {
    console.log("Usuario no encontrado");
    res.send({error: "Usuario no encontrado"});
}

export const logout = async (req, res) => {
    req.session.destroy((err)=>{
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/');
    });
}

export const githubcallback = async (req, res) => {
    req.session.user = req.user
    res.redirect("/products")
}