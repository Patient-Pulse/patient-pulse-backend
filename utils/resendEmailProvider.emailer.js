import { Resend } from "resend";

const data = {
  patient_id: "123456",
  visit_date: "2025-03-31",
  weight: "70",
  blood_pressure: "120/80",
  heart_rate: "72",
  temperature: "36.6",
  blood_sugar: "90",
  symptoms: "Mild fever, headache",
  diagnosis: "Viral infection",
  medications_prescribed: "Paracetamol, Cough Syrup",
  treatment_plan: "Rest, hydration, and prescribed medication",
  notes: "Follow-up in 7 days",
  from: "team@patientpulse.tech",
  to: "maheshmorem1787@gmail.com",
};

export const resendEmailProvider = async (visit) => {
  const resendApiKey = process.env.RESEND_API_KEY;

  const resend = new Resend(resendApiKey);

  const { patient } = visit;

  const emailTemplate = `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Patient Visit Report</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <!-- Header -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a5276; margin-bottom: 20px;">
                <tr>
                    <td style="padding: 20px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0;">Patient Pulse</h1>
                        <p style="color: #aed6f1; margin: 5px 0 0 0;">Your Health Matters To Us</p>
                    </td>
                </tr>
            </table>

            <!-- Patient Info -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; border: 1px solid #ddd; background-color: #f9f9f9;">
                <tr>
                    <td style="padding: 15px;">
                        <h2 style="color: #1a5276; margin-top: 0; border-bottom: 2px solid #1a5276; padding-bottom: 5px; display: inline-block;">Patient Information</h2>
                        <p style="margin-bottom: 5px;"><strong>Name:</strong> ${patient.full_name}</p>
                        <p style="margin-bottom: 5px;"><strong>Date of Birth:</strong> ${patient.date_of_birth}</p>
                        <p style="margin-bottom: 5px;"><strong>Gender:</strong> ${patient.gender}</p>
                        <p style="margin-bottom: 0;"><strong>Visit Date:</strong> ${visit.visit_date}</p>
                    </td>
                </tr>
            </table>

            <!-- Vital Signs -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; border: 1px solid #ddd;">
                <tr>
                    <td style="padding: 15px; background-color: #f9f9f9;">
                        <h2 style="color: #1a5276; margin-top: 0; border-bottom: 2px solid #1a5276; padding-bottom: 5px; display: inline-block;">Vital Signs</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 15px;">
                        <table width="100%" cellpadding="5" cellspacing="0">
                            <tr>
                                <td width="50%" style="border-bottom: 1px solid #eee;"><strong>Blood Pressure:</strong></td>
                                <td width="50%" style="border-bottom: 1px solid #eee;">${visit.blood_pressure}</td>
                            </tr>
                            <tr>
                                <td width="50%" style="border-bottom: 1px solid #eee;"><strong>Heart Rate:</strong></td>
                                <td width="50%" style="border-bottom: 1px solid #eee;">${visit.heart_rate} bpm</td>
                            </tr>
                            <tr>
                                <td width="50%" style="border-bottom: 1px solid #eee;"><strong>Temperature:</strong></td>
                                <td width="50%" style="border-bottom: 1px solid #eee;">${visit.temperature} °C</td>
                            </tr>
                            <tr>
                                <td width="50%"><strong>Weight:</strong></td>
                                <td width="50%">${visit.weight} KG</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <!-- Diagnosis & Treatment -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px; border: 1px solid #ddd;">
                <tr>
                    <td style="padding: 15px; background-color: #f9f9f9;">
                        <h2 style="color: #1a5276; margin-top: 0; border-bottom: 2px solid #1a5276; padding-bottom: 5px; display: inline-block;">Medical Summary</h2>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 15px;">
                        <h3 style="color: #1a5276; margin-top: 0;">Symptoms</h3>
                        <p style="background-color: #f5f5f5; padding: 10px; border-left: 3px solid #1a5276; margin: 0 0 15px 0;">${visit.symptoms}</p>

                        <h3 style="color: #1a5276; margin-top: 0;">Diagnosis</h3>
                        <p style="background-color: #f5f5f5; padding: 10px; border-left: 3px solid #1a5276; margin: 0 0 15px 0;">${visit.diagnosis}</p>

                        <h3 style="color: #1a5276; margin-top: 0;">Medications Prescribed</h3>
                        <p style="background-color: #f5f5f5; padding: 10px; border-left: 3px solid #1a5276; margin: 0 0 15px 0;">${visit.medications_prescribed}</p>

                        <h3 style="color: #1a5276; margin-top: 0;">Treatment Plan</h3>
                        <p style="background-color: #f5f5f5; padding: 10px; border-left: 3px solid #1a5276; margin: 0;">${visit.treatment_plan}</p>
                    </td>
                </tr>
            </table>

            <!-- Footer -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; margin-top: 20px;">
                <tr>
                    <td style="padding: 15px; text-align: center;">
                        <p style="margin: 0; color: #666; font-size: 12px;">This is an automated message from Patient Pulse. Please do not reply to this email.</p>
                        <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">© 2025 Patient Pulse. All rights reserved.</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>`;

  try {
    const response = await resend.emails.send({
      from: visit.from,
      to: visit.to,
      subject: "Patient Visit Report",
      html: emailTemplate,
    });

    if(response.error != null) {
        throw new Error(response.error);
    }

    console.log("Email sent successfully:", response);
    return { status: "success", message: "Email sent successfully", response };
  } catch (error) {
    console.error("Error sending email:", error);
  }
};