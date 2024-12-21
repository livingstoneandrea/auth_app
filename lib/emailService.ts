import axios, { AxiosInstance } from "axios";

export interface EmailPayload {
  to: string | string[]; // Single recipient or multiple recipients
  subject: string;
  body: string;
  from?: string;
  priority?: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
  data?: any;
}

class EmailService {
  private client: AxiosInstance;

  constructor(baseURL: string, apiKey: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${apiKey}`,
      },
    });
  }

  /**
   * Send an email using the REST API.
   * @param payload EmailPayload - The email details.
   * @returns Promise<EmailResponse> - The server's response.
   */
  async sendEmail(payload: EmailPayload): Promise<EmailResponse> {
    try {
      const response = await this.client.post("/send_email", payload);
      return {
        success: true,
        message: "Email sent successfully.",
        data: response.data,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to send email.";
      return {
        success: false,
        message: errorMessage,
        data: error.response?.data,
      };
    }
  }

  

  
}

export default EmailService;
