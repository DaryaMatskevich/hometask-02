import nodemailer from 'nodemailer'


export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
        let transport = nodemailer.createTransport({
            host: "smtp.mail.ru",
            port: 465,
            secure: true,
            auth: {
                user: "backendlessons@mail.ru",
                pass: "P7RQbjw9DkmdvNzF0jH1",
            },
        })

        let info = await transport.sendMail({
            from: 'Backend-Lessons <backendlessons@mail.ru>',
            to: email,
            subject: subject,
            html: message,
        })
        return info
    }
}