import { Router } from "express"
import { usuariosModelo } from "../dao/models/users.model.js"

export const router=Router()

router.post('/login', async(req, res)=>{
    let {email, password} = req.body
    if(!email || !password){
        return res.redirect('/login?error=Complete todoslos datos')
    }

    if (email === "adminCoder@coder.com" && password === "adminCod3r123"){
        req.session.rol = true
        req.session.usuario = true
        return res.redirect('/perfil')
    }

    let usuario = await usuariosModelo.findOne({email, password})
    if (!usuario) {
        return res.redirect('/login?error=credenciales incorrectas')
    }

    req.session.usuario={
        nombre:usuario.nombre, email:usuario.email, age:usuario.age, apellido:usuario.apellido
    }

    res.redirect('/productos')
})

router.post('/registro', async(req, res)=>{
    let {nombre, email, password, age, apellido} = req.body
    if (!nombre || !email || !password || !age || !apellido){
        res.redirect('/registro?error=Complete todos los datos')
    }

    let existe = await usuariosModelo.findOne({email})
    if (existe) {
        return res.redirect(`/registro?error=Existen usuarios con este email ${email}`)
    }

    let usuario
    try {
        usuario = await usuariosModelo.create({nombre, apellido, email, age, password})
        res.redirect(`/login?mensaje=Usuario ${email} registrado correctamente`)
    } catch (error) {
        res.redirect('/registro?error=Error inesperado. Reintente en unos minutos')
    }
})

router.get('/logout',(req,res)=>{
    
    req.session.destroy(error=>{
        if(error){
            res.redirect('/login?error=fallo en el logout')
        }
    })

    res.redirect('/login')
})

router.get('clientes', async (req, res)=>{

    try {
        const usuarios = await usuariosModelo.find()
    } catch (error) {
        res.status(500).send('Error al recuperar usuarios')
    }
})