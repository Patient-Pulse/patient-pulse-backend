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

export const resendEmailProvider = async () => {
    const resendApiKey = process.env.RESEND_API_KEY;
    
    const resend = new Resend(resendApiKey);

    const emailTemplate = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Patient Visit Report</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Arial', sans-serif;
                background-color: #f0f4f8;
                color: #333;
                line-height: 1.6;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 30px auto;
                background: #ffffff;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                padding: 40px;
            }
            .header {
                text-align: center;
                font-size: 28px;
                font-weight: bold;
                color: #333;
                padding-bottom: 20px;
                border-bottom: 2px solid #ddd;
                margin-bottom: 20px;
            }
            .section {
                display: flex;
                justify-content: space-between;
                margin: 20px 0;
                padding: 12px;
                background: #f9f9f9;
                border-radius: 8px;
                transition: all 0.3s ease;
            }
            .section:hover {
                background: #e6f7ff;
            }
            .section h3 {
                color: #4b8bf9;
                font-size: 16px;
                font-weight: bold;
                flex: 0 0 40%;
            }
            .section p {
                color: #555;
                font-size: 14px;
                flex: 0 0 55%;
                word-wrap: break-word;
            }
            .footer {
                text-align: center;
                font-size: 12px;
                color: #aaa;
                margin-top: 30px;
                border-top: 1px solid #ddd;
                padding-top: 20px;
            }
            .footer a {
                color: #4b8bf9;
                text-decoration: none;
            }
            @media (max-width: 600px) {
                .container {
                    padding: 25px;
                }
                .header {
                    font-size: 24px;
                }
                .section {
                    flex-direction: column;
                    align-items: flex-start;
                }
                .section h3 {
                    margin-bottom: 5px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Patient Visit Report</div>

            <div class="section">
                <h3>Patient ID:</h3>
                <p>${data.patient_id}</p>
            </div>
            <div class="section">
                <h3>Visit Date:</h3>
                <p>${data.visit_date}</p>
            </div>
            <div class="section">
                <h3>Weight:</h3>
                <p>${data.weight} kg</p>
            </div>
            <div class="section">
                <h3>Blood Pressure:</h3>
                <p>${data.blood_pressure}</p>
            </div>
            <div class="section">
                <h3>Heart Rate:</h3>
                <p>${data.heart_rate} bpm</p>
            </div>
            <div class="section">
                <h3>Temperature:</h3>
                <p>${data.temperature} °C</p>
            </div>
            <div class="section">
                <h3>Blood Sugar:</h3>
                <p>${data.blood_sugar} mg/dL</p>
            </div>
            <div class="section">
                <h3>Symptoms:</h3>
                <p>${data.symptoms}</p>
            </div>
            <div class="section">
                <h3>Diagnosis:</h3>
                <p>${data.diagnosis}</p>
            </div>
            <div class="section">
                <h3>Medications Prescribed:</h3>
                <p>${data.medications_prescribed}</p>
            </div>
            <div class="section">
                <h3>Treatment Plan:</h3>
                <p>${data.treatment_plan}</p>
            </div>
            <div class="section">
                <h3>Doctor's Notes:</h3>
                <p>${data.notes}</p>
            </div>

            <div class="footer">
                This is an automated email. Please do not reply. <br>
                <a href="mailto:doctor@example.com">Contact the doctor</a> for further assistance.
            </div>
        </div>
    </body>
    </html>`;

    try {
        const response = await resend.emails.send({
            from: data.from,
            to: data.to,
            subject: "Patient Visit Report",
            html: emailTemplate,
        });

        console.log("Email sent successfully:", response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

// import { SendMailClient } from "zeptomail";

// // For CommonJS
// // var { SendMailClient } = require("zeptomail");

// const url = "api.zeptomail.in/";
// const token = "<SEND_MAIL_TOKEN>";

// let client = new SendMailClient({url, token});

// client.sendMail({
//     "from": 
//     {
//         "address": "<DOMAIN>",
//         "name": "noreply"
//     },
//     "to": 
//     [
//         {
//         "email_address": 
//             {
//                 "address": "maheshmorem2399@gmail.com",
//                 "name": "Mahesh"
//             }
//         }
//     ],
//     "subject": "Test Email",
//     "htmlbody": "<div><b> Test email sent successfully.</b></div>",
// }).then((resp) => console.log("success")).catch((error) => console.log("error"));
// import SibApiV3Sdk from 'sib-api-v3-sdk';

// var defaultClient = SibApiV3Sdk.ApiClient.instance;

// var apiKey = defaultClient.authentications['api-key'];
// apiKey.apiKey = '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';
// var apiInstance = new SibApiV3Sdk.EmailCampaignsApi();
// var emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();

// emailCampaigns.name = "Campaign sent via the API";
// emailCampaigns.subject = "My subject";
// emailCampaigns.sender = {"name": "From name", "email": "myfromemail@mycompany.com"};
// emailCampaigns.type = "classic";
// emailCampaigns.htmlContent = 'Congratulations! You successfully sent this example campaign via the Brevo API.'; //Correct location

// emailCampaigns.recipients = {listIds: [2, 7]}; //Correct location

// emailCampaigns.scheduledAt = '2018-01-01 00:00:01'; //Correct location

// apiInstance.createEmailCampaign(emailCampaigns).then(function(data) {
//   console.log('API called successfully. Returned data: ' + JSON.stringify(data)); //It is good practice to stringify the data.
// }, function(error) {
//   console.error(error);
// });

// export const brevoEmailSender = (data) => {
//     const apikey = "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";
//     const url = "https://api.sendinblue.com/v3/smtp/email";
  
//     const emailData = {
//       sender: {
//         name: 'Mahesh Morem',
//         email: 'maheshmorem1787@gmail.com'
//       },
//       to: [{ email: 'moremchandramouli56@gmail.com', name: 'Morem Chandramouli' }],
//       subject: 'Test Email',
//       htmlContent: `<html><body><h1>Hello, Pakodi</h1><p>This is a test email.</p></body></html>`
//     };
  
//     fetch(url, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         "api-key": apikey,
//       },
//       body: JSON.stringify(emailData),
//     })
//       .then(async (response) => {
//         if (!response.ok) {
//           const errorData = await response.json();
//             throw new Error(JSON.stringify(errorData));
//         }
//         console.log(await response.json())
//         return response.json();
//       })
//       .then((responseData) => {
//         console.log("Email sent successfully:", responseData);
//       })
//       .catch((error) => {
//         console.error("Error sending email:", error.message);
//       });
  
//     return emailData;
//   };
// import brevo from '@getbrevo/brevo';

// export const brevoEmailSender = async (data) => {
//   try {
//     // Initialize configuration
//     const configuration = brevo.Configuration.getDefaultConfiguration();
//     configuration.apiKey['api-key'] = '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'; // Replace with your key

//     // Create API instance
//     const apiInstance = new brevo.TransactionalEmailsApi();

//     // Configure email
//     const sendSmtpEmail = new brevo.SendSmtpEmail({
//       sender: { 
//         name: "Clinic Name",
//         email: "noreply@clinic.com" 
//       },
//       to: [{ email: data.recipientEmail, name: data.recipientName }],
//       subject: data.subject,
//       htmlContent: data.htmlContent
//     });

//     // Send email
//     const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
//     return response;
//   } catch (err) {
//     console.error('Brevo API Error:', err.response?.body || err.message);
//     throw new Error('Failed to send email');
//   }
// };