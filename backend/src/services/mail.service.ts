import nodemailer, { Transporter, SentMessageInfo } from "nodemailer";

// Email configuration interface
export interface EmailConfig {
	gmailId: string;
	googleAppPassword: string;
	smtpHost?: string;
	smtpPort?: number;
}

// Type guard function for error handling
function isError(error: unknown): error is Error {
	return error instanceof Error;
}

// Module-level variables with proper typing
let smtpHost: string | undefined = process.env.SMTP_HOST;
let smtpPort: string | undefined = process.env.SMTP_PORT;

let USER: string | undefined;
let APP_PASSWORD: string | undefined;
let SMTPHOST: string | undefined;
let SMTPPORT: number | undefined;
let transporter: Transporter | null;

const config = async (options: EmailConfig): Promise<void> => {
	USER = options.gmailId;
	APP_PASSWORD = options.googleAppPassword;
	SMTPHOST = options.smtpHost || "smtp.gmail.com";
	SMTPPORT = options.smtpPort || 465;
	console.log(`Configuration successful!`);
	transporter = createTransporter();

	// Verify the transporter configuration
	if (transporter) {
		await transporter.verify();
	}
};

const createTransporter = (): Transporter | null => {
	try {
		if (!USER || !APP_PASSWORD) {
			throw new Error(
				"USER and APP_PASSWORD must be configured using config()"
			);
		}

		return nodemailer.createTransport({
			host: SMTPHOST,
			port: SMTPPORT,
			secure: true,
			auth: {
				user: USER,
				pass: APP_PASSWORD,
			},
			tls: {
				rejectUnauthorized: false,
			},
		});
	} catch (error: unknown) {
		const errorMessage = isError(error) ? error.message : "Unknown error";
		console.error(errorMessage);
		return null;
	}
};

const sendMail = async (
	sendTo: string,
	subject: string = "Sent using Mail Sender",
	content: string = "Test Email"
): Promise<SentMessageInfo> => {
	try {
		if (!USER || !APP_PASSWORD) {
			throw new Error(
				"USER and APP_PASSWORD must be configured using config()"
			);
		}

		if (transporter) {
			transporter.verify(function (error: Error | null, _success: boolean) {
				if (error) {
					console.log(error.message);
				} else {
					console.log(
						`Attempting to connect to server: ${smtpHost} at PORT: ${smtpPort}`
					);
					console.log(`Server is ready to send emails from: ${USER}`);
				}
			});
		}

		const result = await transporter!.sendMail({
			from: USER,
			to: sendTo,
			subject: subject,
			html: content,
		});

		console.log(`Mail sent successfully to ${sendTo} from ${USER}!`);
		return result;
	} catch (error: unknown) {
		const errorMessage = isError(error) ? error.message : "Unknown error";
		console.error(errorMessage);
		throw error;
	}
};

export { sendMail, config };
