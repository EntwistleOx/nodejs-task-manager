const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'juan.diaz.12069@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app ${name} =)` 
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'juan.diaz.12069@gmail.com',
        subject: 'Cancelled account',
        text: `Goodbye ${name}, see you soon =(` 
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}