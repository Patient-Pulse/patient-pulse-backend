import { Resend } from "resend";

// const data = {
//     patient_id: "123456",
//     visit_date: "2025-03-31",
//     weight: "70",
//     blood_pressure: "120/80",
//     heart_rate: "72",
//     temperature: "36.6",
//     blood_sugar: "90",
//     symptoms: "Mild fever, headache",
//     diagnosis: "Viral infection",
//     medications_prescribed: "Paracetamol, Cough Syrup",
//     treatment_plan: "Rest, hydration, and prescribed medication",
//     notes: "Follow-up in 7 days",
//     from: "team@patientpulse.tech",
//     to: "maheshmorem1787@gmail.com",
// };

export const resendEmailProvider = async (data) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    
    const resend = new Resend(resendApiKey);

    const emailTemplate = `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your Health Summary</title>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>
                /* Base styles */
                body {
                    font-family: 'Poppins', Arial, sans-serif;
                    line-height: 1.6;
                    color: #4a5568;
                    background-color: #f7fafc;
                    margin: 0;
                    padding: 0;
                }
                
                .email-container {
                    max-width: 640px;
                    margin: 0 auto;
                    background: #ffffff;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
                }
                
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 40px 30px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }
                
                .header::before {
                    content: "";
                    position: absolute;
                    top: -50px;
                    right: -50px;
                    width: 200px;
                    height: 200px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 50%;
                }
                
                .header::after {
                    content: "";
                    position: absolute;
                    bottom: -80px;
                    left: -80px;
                    width: 250px;
                    height: 250px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 50%;
                }
                
                .logo {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 15px;
                    z-index: 2;
                    position: relative;
                }
                
                .header h1 {
                    margin: 0;
                    font-size: 28px;
                    font-weight: 600;
                    z-index: 2;
                    position: relative;
                }
                
                .header p {
                    opacity: 0.9;
                    font-weight: 300;
                    margin-top: 10px;
                    z-index: 2;
                    position: relative;
                }
                
                .content {
                    padding: 40px;
                }
                
                .patient-info {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    background: #f8fafc;
                    padding: 20px;
                    border-radius: 12px;
                    margin-bottom: 30px;
                }
                
                .patient-avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 3px solid #e2e8f0;
                }
                
                .patient-details h3 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                }
                
                .patient-details p {
                    margin: 5px 0 0;
                    color: #718096;
                    font-size: 14px;
                }
                
                .section {
                    margin-bottom: 30px;
                }
                
                .section-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #2d3748;
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #edf2f7;
                }
                
                .section-title img {
                    width: 24px;
                    height: 24px;
                }
                
                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                }
                
                .info-item {
                    background: #f8fafc;
                    padding: 18px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .info-icon {
                    width: 24px;
                    height: 24px;
                    flex-shrink: 0;
                }
                
                .info-content {
                    flex: 1;
                }
                
                .info-label {
                    font-size: 13px;
                    color: #718096;
                    margin-bottom: 5px;
                }
                
                .info-value {
                    font-size: 16px;
                    font-weight: 500;
                    color: #2d3748;
                }
                
                .full-width {
                    grid-column: span 2;
                }
                
                .diagnosis-card {
                    background: #fff5f5;
                    border-left: 4px solid #fc8181;
                    padding: 18px;
                    border-radius: 8px;
                    margin-top: 15px;
                }
                
                .medication-card {
                    background: #ebf8ff;
                    border-left: 4px solid #63b3ed;
                    padding: 18px;
                    border-radius: 8px;
                    margin-top: 15px;
                }
                
                .treatment-card {
                    background: #f0fff4;
                    border-left: 4px solid #68d391;
                    padding: 18px;
                    border-radius: 8px;
                    margin-top: 15px;
                }
                
                .card-title {
                    font-weight: 600;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .card-title img {
                    width: 18px;
                    height: 18px;
                }
                
                .footer {
                    background: #2d3748;
                    padding: 30px;
                    text-align: center;
                    font-size: 12px;
                    color: #a0aec0;
                }
                
                .footer-links {
                    display: flex;
                    justify-content: center;
                    gap: 20px;
                    margin-bottom: 20px;
                }
                
                .footer-links a {
                    color: #e2e8f0;
                    text-decoration: none;
                    font-size: 14px;
                }
                
                .social-icons {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-bottom: 20px;
                }
                
                .social-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: #4a5568;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .social-icon img {
                    width: 16px;
                    height: 16px;
                }
                
                @media only screen and (max-width: 480px) {
                    .info-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .full-width {
                        grid-column: span 1;
                    }
                    
                    .patient-info {
                        flex-direction: column;
                        text-align: center;
                    }
                }
            </style>
        </head>

        <body>
            <div class="email-container">
                <div class="header">
                    <div class="logo">
                        <img src="https://cdn-icons-png.flaticon.com/512/2906/2906274.png" width="32" height="32" alt="Logo">
                        PatientPulse.tech
                    </div>
                    <h1>Your Visit Summary</h1>
                    <p>Here's a summary of your recent visit to our clinic</p>
                </div>
                
                <div class="content">
                    <div class="patient-info">
                        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" class="patient-avatar" alt="Patient">
                        <div class="patient-details">
                            <h3>Patient Name: ${data.patient_name}</h3>
                            <p>Visit Date: ${data.visit_date}</p>
                        </div>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">
                            <img src="https://cdn-icons-png.flaticon.com/512/3023/3023981.png" alt="Vitals">
                            Vital Signs
                        </div>
                        <div class="info-grid">
                            <div class="info-item">
                                <img src="https://cdn-icons-png.flaticon.com/512/3480/3480608.png" class="info-icon" alt="Weight">
                                <div class="info-content">
                                    <div class="info-label">Weight</div>
                                    <div class="info-value">${data.weight} kg</div>
                                </div>
                            </div>
                            <div class="info-item">
                                <img src="https://cdn-icons-png.flaticon.com/512/3023/3023986.png" class="info-icon" alt="Blood Pressure">
                                <div class="info-content">
                                    <div class="info-label">Blood Pressure</div>
                                    <div class="info-value">${data.blood_pressure}</div>
                                </div>
                            </div>
                            <div class="info-item">
                                <img src="https://cdn-icons-png.flaticon.com/512/3039/3039373.png" class="info-icon" alt="Heart Rate">
                                <div class="info-content">
                                    <div class="info-label">Heart Rate</div>
                                    <div class="info-value">${data.heart_rate} bpm</div>
                                </div>
                            </div>
                            <div class="info-item">
                                <img src="https://cdn-icons-png.flaticon.com/512/3183/3183066.png" class="info-icon" alt="Temperature">
                                <div class="info-content">
                                    <div class="info-label">Temperature</div>
                                    <div class="info-value">${data.temperature} °C</div>
                                </div>
                            </div>
                            <div class="info-item full-width">
                                <img src="https://cdn-icons-png.flaticon.com/512/2940/2940517.png" class="info-icon" alt="Blood Sugar">
                                <div class="info-content">
                                    <div class="info-label">Blood Sugar</div>
                                    <div class="info-value">${data.blood_sugar} mg/dL</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">
                            <img src="https://cdn-icons-png.flaticon.com/512/2785/2785482.png" alt="Diagnosis">
                            Diagnosis
                        </div>
                        <div class="info-item full-width">
                            <img src="https://cdn-icons-png.flaticon.com/512/3022/3022831.png" class="info-icon" alt="Symptoms">
                            <div class="info-content">
                                <div class="info-label">Symptoms</div>
                                <div class="info-value">${data.symptoms}</div>
                            </div>
                        </div>
                        
                        <div class="diagnosis-card">
                            <div class="card-title">
                                <img src="https://cdn-icons-png.flaticon.com/512/3159/3159120.png" alt="Diagnosis">
                                Diagnosis
                            </div>
                            <div>${data.diagnosis}</div>
                        </div>
                    </div>
                    
                    <div class="section">
                        <div class="section-title">
                            <img src="https://cdn-icons-png.flaticon.com/512/2064/2064696.png" alt="Treatment">
                            Treatment Plan
                        </div>
                        
                        <div class="medication-card">
                            <div class="card-title">
                                <img src="https://cdn-icons-png.flaticon.com/512/2736/2736992.png" alt="Medication">
                                Medications Prescribed
                            </div>
                            <div>${data.medications_prescribed}</div>
                        </div>
                        
                        <div class="treatment-card">
                            <div class="card-title">
                                <img src="https://cdn-icons-png.flaticon.com/512/2936/2936886.png" alt="Treatment">
                                Treatment Instructions
                            </div>
                            <div>${data.treatment_plan}</div>
                        </div>
                        
                        <div class="info-item full-width" style="margin-top: 15px;">
                            <img src="https://cdn-icons-png.flaticon.com/512/3176/3176272.png" class="info-icon" alt="Notes">
                            <div class="info-content">
                                <div class="info-label">Doctor's Notes</div>
                                <div class="info-value">${data.notes}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="footer">
                    <div class="footer-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Contact Us</a>
                    </div>
                    <p>© 2025 HealthCare+ Patient Management System. All rights reserved.</p>
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