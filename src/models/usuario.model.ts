interface usuario{
    id : string;
    nombre : string;
    correo : string;
    password : string;
    rol : 'admin' | 'user';
    fechaCreacion : Date;
}

export {usuario}