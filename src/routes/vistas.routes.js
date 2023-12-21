import { Router } from 'express'
import { usuariosModelo } from "../dao/models/users.model.js"
export const router=Router()

const auth=(req, res, next)=>{
    if(!req.session.usuario){
        return res.redirect('/login')
    }

    next()
}

const auth2=(req, res, next)=>{
    if(req.session.usuario){
        return res.redirect('/perfil')
    }

    next()
}

router.get('/',(req,res)=>{

    // let login=false
    // if(req.session.usuario){
    //     login=true
    // }

    res.setHeader('Content-Type','text/html')
    res.status(200).render('home', {login:req.session.usuario?true:false, rol:false})
})

router.get('/registro', auth2, (req,res)=>{

    let {error}=req.query

    res.setHeader('Content-Type','text/html')
    res.status(200).render('registro', {error, login:false, rol:false})
})

router.get('/login', auth2, (req,res)=>{

    let {error, mensaje}=req.query

    res.setHeader('Content-Type','text/html')
    res.status(200).render('login', {error, mensaje, login:false, rol:false})
})

router.get('/perfil', auth, (req,res)=>{

    let usuario=req.session.usuario
    let rol = req.session.rol

    res.setHeader('Content-Type','text/html')
    res.status(200).render('perfil', {usuario, login:true, rol})
})

router.get('/productos', auth, (req,res)=>{

    let usuario=req.session.usuario
    let rol = req.session.rol

    res.setHeader('Content-Type','text/html')
    res.status(200).render('productos', {usuario, login:true, rol})
})


router.get('/clientes', auth, async (req, res) => {
    try {
        const usuarios = await usuariosModelo.find()
        console.log(usuarios); // Agrega esta línea para verificar los datos en la consola
        res.setHeader('Content-Type', 'text/html')
        res.status(200).render('clientes', { usuarios, login: true, rol: req.session.rol })
    } catch (error) {
        res.status(500).send('Error al recuperar usuarios')
    }
});



