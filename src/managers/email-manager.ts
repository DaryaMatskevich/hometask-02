import { emailAdapter } from "../adapters/email-adapter"

export const emailManager = {
    async sendEmailRecoveryMessage(user: any) {
        const recoveryLink = `https://some-front.com/password-recovery?code=${user.confirmationCode}`;

        const message = `
            <h1>Password Recovery</h1>
            <p>To reset your password, please follow the link below:</p>
            <a href='${recoveryLink}'>Reset your password</a>
            <p>If you did not request a password reset, please ignore this email.</p>
        `;

        await emailAdapter.sendEmail(user.email, "Password Recovery", message);

    },

    async sendEmailConfirmationMessage(user: any) {
        const confirmationLink = `https://some-front.com/confirm-registration?code=${user.confirmationCode}`;

        const message = `
<h1>Thank you for your registration</h1>
<p>To finish registration, please follow the link below:</p>
<a href='${confirmationLink}'>Complete registration</a>
`;
        await emailAdapter.sendEmail(user.email, "Confirm your email", message)
    },

    async sendPasswordRecoveryMessage(user: any, recoveryCode: string) {
        const confirmationLink = `https://somesite.com/password-recovery?recoveryCode=${recoveryCode}`;

        const message = `
<h1>Password recovery</h1>
<p>To finish password recovery please follow the link below:
<a href='${confirmationLink}'>Password recovery</a></p>
`;
        await emailAdapter.sendEmail(user.email, "Password recovery", message)
    },

}