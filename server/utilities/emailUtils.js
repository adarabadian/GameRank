const nodemailer = require('nodemailer');

const sendVerificationEmail = (emailAddress, verCode) =>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'adargamerank@gmail.com',
            pass: 'iewkjdtltquefxlu'
        }
    });
    
    const mailOptions = {
        from: 'adargamerank@gmail.com', 
        to: emailAddress,
        subject: 'GamerRank verification code',
        text: 'Hi!\nYour personal verification code is: ' + verCode,
        html: `
            <div style="text-align: center; margin: auto; background: #39396c; color: white; padding: 3rem; font-family: 'Google Sans'; letter-spacing: 1px; width: 40rem; border-radius: 25px;">
                <h2>GameRank verification code</h2>
                <p>
                    Hi, I'm GameRanks personal assistant<br><br/>
                    This is the code you need to insert in GameRank system: 
                    <b>` + verCode + `</b><br><br/> 
                    Thanks,<br/>
                    GameRank system
                </p>
            </div>`
    };
    
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


module.exports = {
    sendVerificationEmail,
}
