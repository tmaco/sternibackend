const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt");
const User = require("../models/user");
const { UPLOADPATH } = require("../config");
const Registro = require("../models/registro");


function signUp(req, res) {
    const user = new User;

    const {
        first_name, last_name, email, password, repeatPassword
    } = req.body;

    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email.toLowerCase();
    user.role = "user";
    user.active = false;

    if(!password || !repeatPassword) {
        res.status(404).send({message: "Las contraseñas son obligatorias."});
    } else {
        if(password !== repeatPassword)
            res.status(404).send({message: "Las contraseñas no son iguales."});
        else {
            bcrypt.hash(password, null, null, function(err, hash){
             if(err)
                res.status(404).send({message: "Error al encriptar la contraseña."}); 
             else{
                user.password = hash;
                user.save((err, userStored) => {
                    if(err)
                        res.status(500).send({message: "El usuario ya existe."});
                    else {
                        if(!userStored)
                            res.status(404).send({message: "Error al crear el usuario."});
                        else{
                            //res.status(200).send({userStored});

                            const registro = new Registro();
                            registro.tabla = "user";
                            registro.tipo = "add"; 
                            registro.usuario = user.email; 
                            registro.mensaje = "Usuario creado";

                            registro.save((err, registroCreated) => {
                                if(err){
                                    res.status(500).send({ message: "Error del servidor."});
                                } else {
                                    if(!registroCreated) {
                                        res.status(404).send({ message: "Error al crear el registro."});
                                        } else {
                                            res.status(200).send({userStored});
                                        }
                                }
                            });

                        }
                    }
                })
            }   
            });
        }
    }
        

}

function signIn(req, res) {
    const params = req.body;
    const email = params.email.toLowerCase();
    const password = params.password;

    User.findOne({email}, (err, userStored) => {
        if(err) {
            res.status(500).send({message: "Error del servidor."});
        } else {
            if(!userStored) {
                res.status(404).send({message: "Usuario no encontrado."});
            } else {
                bcrypt.compare(password, userStored.password, (err, check) => {
                    if(err) {
                        res.status(500).send({message: "Error del servidor."});
                    } else if(!check) {
                        res.status(404).send({message: "La contraseña es incorrecta."});
                    } else {
                        if(!userStored.active){
                            res.status(200)
                            .send({code: 200, message: "El usuario no se ha activado."});
                        } else {
                            res.status(200).send({
                                accessToken: jwt.createAccessToken(userStored),
                                refreshToken: jwt.createRefreshToken(userStored)
                            })
                        }
                    }
                });
            }
        }
    });
}

function getUsers(req, res) {
    User.find().then(users => {
        if(!users) {
            res.status(404).send({ message: "No se ha encontrado ningun usuario."});
        } else {
            res.status(200).send({ users });
        }
    });
}

function getUsersActive(req, res) {
    const query = req.query;

    User.find({ active: query.active }).then(users => {
        if(!users) {
            res.status(404).send({ message: "No se ha encontrado ningun usuario."});
        } else {
            res.status(200).send({ users });
        }
    });
}

function uploadAvatar(req, res) {
    const params = req.params;

    User.findById({_id: params.id}, (err,userData) => {
        if(err) {
            err.status(500).send({ message: "Error del servidor."});
        } else {
            if(!userData) {
                err.status(404).send({ message: "Usuario no encontrado."});
            } else {
                let user = userData;
                
                if(req.files) {
                    let filePath = req.files.avatar.path;
                    let fileSplit = filePath.split("/");
                    let fileName = fileSplit[2];

                    let extSplit = fileName.split(".");
                    let fileExt = extSplit[1];

                    if(fileExt !== "png" && fileExt !== "jpeg") {
                        res.status(400)
                        .send({ 
                            message: "La extension de la imagen no es valida. Extensiones permitidas .png y .jpeg"
                        });
                    } else {
                        user.avatar = fileName;
                        User.findByIdAndUpdate({
                            _id: params.id
                        }, user, (err, userResult) => {
                            if(err) {
                                err.status(500).send({ message: "Error del servidor."})

                            } else {
                                if(!userResult) {
                                    err.status(404).send({ message: "Usuario no encontrado."});
                                } else {
                                    res.status(200).send({ avatarName: fileName});
                                }
                            }
                        });
                    }

                }

            }
        }
    })
}

function getAvatar(req,res) {
    const AvatarName = req.params.avatarName;
    const filePath = UPLOADPATH + AvatarName;

    fs.exists(filePath, exists => {
        if(!exists) {
            res.status(404).send({ message: "El avatar que buscas no existe"});
        } else {
            res.sendFile(path.resolve(filePath));
        }
    });
    
}

async function updateUser(req, res) {
    let userData = req.body;
    userData.email = req.body.email.toLowerCase();
    const params = req.params;

    if(userData.password) {
        await bcrypt.hash(userData.password, null, null, (err, hash) => {
            if(err) {
                res.status(500).send({ message: "Error al encriptar la contraseña." })
            } else {
                userData.password = hash;
            }
        });
    }

    User.findByIdAndUpdate({_id: params.id}, userData, (err, userUpdate) => {
        if(err) {
            err.status(500).send({ message: "Error del servidor."});
        } else {
            if(!userUpdate) {
                err.status(404).send({ message: "Usuario no encontrado."});
            } else {
                res.status(200).send({ message: "Usuario actualizado correctamente."});
            }
        }
    });
}

function activateUser(req, res){
    const { id } = req.params;
    const { active } = req.body;

    User.findByIdAndUpdate(id, { active}, (err, userStored) => {
        if(err) {
            res.status(500).send({ message: "Error del servidor."});
        } else {
            if(!userStored) {
                res.status(404).send({ message: "Usuario no encontrado."});
            } else {
                if(active === true) {
                    res.status(200).send({ message: "Usuario activado correctamente."});
                } else {
                    res.status(200).send({ message: "Usuario desactivado correctamente."});
                }
            }
        }
    } )
}

function deleteUser(req, res){
    const { id } = req.params;
    
    User.findByIdAndRemove(id, (err, userDeleted) => {
        if(err) {
            res.status(500).send({ message: "Error del servidor."});
        } else {
            if(!userDeleted) {
                res.status(404).send({ message: "Usuario no encontrado."});
            } else {
                const registro = new Registro();
                registro.tabla = "user";
                registro.tipo = "delete"; 
                registro.usuario = id; 
                registro.mensaje = "Usuario eliminado";

                registro.save((err, registroCreated) => {
                    if(err){
                        res.status(500).send({ message: "Error del servidor."});
                    } else {
                        if(!registroCreated) {
                            res.status(404).send({ message: "Error al crear el registro."});
                        } else {
                            res.status(200).send({ message: "Usuario eliminado correctamente"});
                        }
                    }
                });
            }
        }
    })
}

function createUser(req, res){
    const user = new User();

    const { first_name, last_name, email, role, password } = req.body;
    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email.toLowerCase();
    user.role = role;
    user.active = true;

    if(!password) {
        res.status(500).send({ message: "La contraseña es obligatoria." });
    } else {
        bcrypt.hash(password, null, null, (err, hash) => {
            if(err){
                res.status(500).send({ message: "Error al encriptar la contraseña." });
            } else {
                user.password = hash;
                user.save((err, userStored) => {
                    if(err){
                        res.status(500).send({ message: "El usuario ya existe." });
                    } else {
                        if(!userStored) {
                            res.status(500).send({ message: "Error al crear el nuevo usuario." });
                        } else {
                            const registro = new Registro();
                            registro.tabla = "user";
                            registro.tipo = "add"; 
                            registro.usuario = user.email; 
                            registro.mensaje = "Usuario creado";

                            registro.save((err, registroCreated) => {
                                if(err){
                                    res.status(500).send({ message: "Error del servidor."});
                                } else {
                                    if(!registroCreated) {
                                        res.status(404).send({ message: "Error al crear el registro."});
                                        } else {
                                            res.status(200).send({ message: "Usuario creado correctamente."});
                                        }
                                }
                            });
                        }
                    }
                })
            }
        });
    }
}

module.exports = {
    signUp,
    signIn,
    getUsers,
    getUsersActive,
    uploadAvatar,
    getAvatar,
    updateUser,
    activateUser,
    deleteUser,
    createUser
};