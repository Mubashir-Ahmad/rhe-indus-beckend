// Creating token and send to cookie

const sendtoken = (user,statusCode,res)=>{
    console.log('Before calling getJWTtoken');
    const token = user.getJWTtoken();
    // option cookie
    console.log('tokeen',token)
    const options={
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE *24*60*60*1000
        ),
        // HttpOnly:true
    };
    res.setHeader('Set-Cookie', `token=${token}; Expires=${options.expires.toUTCString()}; HttpOnly; Secure; Path=${options.path}`);
    res.status(statusCode).cookie("token",token,options).json({
        success:true,
        user,token
    })
   
}
export default sendtoken