const nodemailer = require("nodemailer");


const sendMail = async (sendermail,text)=>{


    let transporter = nodemailer.createTransport({
        service:'Gmail',
        auth: {
            user: 'sourabose2004@gmail.com',
            pass: 'uzixjeiuaawureeq'
        }
    });
    // res.send("I am sending mail");

    let info = await transporter.sendMail({
        from: sendermail,
        to:"sourabose2004@gmail.com",
        subject:"Password Reset Link",
        text:text,
    });
}


module.exports = sendMail;