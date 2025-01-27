
export const fileFilter = ( 
    req: Express.Request, 
    file: Express.Multer.File, cb: Function ) => {

     
            
    if (!file ) {
        return cb ( new Error('No hay archivo'), false );
    }

    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];


    if ( validExtensions.includes( fileExtension ) ) {
        return cb( null, true );
    }

    cb( null, false);

}