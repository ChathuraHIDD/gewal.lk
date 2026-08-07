const layout = ({ title, intro, rows, footer }) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
    </head>

    <body style="margin:0;padding:0;background:#f4f4f7;font-family:Arial, Helvetica, sans-serif;color:#242424;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center" style="padding:40px 15px;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;">
              <tr>
                <td style="background:#9949df;padding:24px;text-align:center;">
                  <h1 style="margin:0;color:#ffffff;font-size:28px;">Gewal.lk</h1>
                </td>
              </tr>

              <tr>
                <td style="padding:32px;">
                  <h2 style="margin-top:0;font-size:22px;">${title}</h2>
                  <p style="line-height:1.6;color:#555555;">${intro}</p>

                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:24px 0;background:#f4eafd;border-radius:10px;overflow:hidden;">
                    ${rows
                      .map(
                        ([label, value]) => `
                      <tr>
                        <td style="padding:12px 18px;color:#7d2bc5;font-weight:bold;font-size:13px;white-space:nowrap;">${label}</td>
                        <td style="padding:12px 18px;color:#242424;">${value}</td>
                      </tr>
                    `
                      )
                      .join("")}
                  </table>

                  <p style="color:#666666;line-height:1.6;">${footer}</p>
                </td>
              </tr>

              <tr>
                <td style="background:#f8f8fa;padding:20px;text-align:center;font-size:12px;color:#888888;">
                  © ${new Date().getFullYear()} Gewal.lk
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;

export const appointmentRequestTemplate = ({
  propertyTitle,
  propertySlug,
  siteUrl,
  appointmentDate,
  appointmentTime,
  requesterName,
  requesterPhone,
  requesterEmail,
  message,
}) => {
  const propertyUrl = `${siteUrl}/properties/${propertySlug}`;

  const rows = [
    ["Property", propertyTitle],
    ["Requested date", appointmentDate],
    ["Requested time", appointmentTime],
    ["Requested by", requesterName],
    ["Phone", requesterPhone || "Not provided"],
    ["Email", requesterEmail],
  ];

  if (message) {
    rows.push(["Note", message]);
  }

  return {
    subject: `New appointment request for "${propertyTitle}"`,

    text: `
You have a new appointment request on Gewal.lk.

Property: ${propertyTitle}
Requested date: ${appointmentDate}
Requested time: ${appointmentTime}
Requested by: ${requesterName}
Phone: ${requesterPhone || "Not provided"}
Email: ${requesterEmail}
${message ? `Note: ${message}\n` : ""}
View the listing: ${propertyUrl}
    `.trim(),

    html: layout({
      title: "New appointment request",
      intro: "Someone requested a viewing appointment for your property listing.",
      rows,
      footer: `You can reply directly to this email to coordinate with the requester, or view the listing at <a href="${propertyUrl}" style="color:#7d2bc5;">${propertyUrl}</a>.`,
    }),
  };
};

export const appointmentConfirmedTemplate = ({
  propertyTitle,
  propertySlug,
  siteUrl,
  appointmentDate,
  appointmentTime,
  contactName,
  contactPhone,
  buyerFirstName,
}) => {
  const propertyUrl = `${siteUrl}/properties/${propertySlug}`;

  const rows = [
    ["Property", propertyTitle],
    ["Confirmed date", appointmentDate],
    ["Confirmed time", appointmentTime],
    ["Contact person", contactName || "Listing contact"],
    ["Contact phone", contactPhone || "Not provided"],
  ];

  return {
    subject: `Confirmed: your appointment for "${propertyTitle}"`,

    text: `
Hello ${buyerFirstName},

Your appointment request has been accepted.

Property: ${propertyTitle}
Confirmed date: ${appointmentDate}
Confirmed time: ${appointmentTime}
Contact person: ${contactName || "Listing contact"}
Contact phone: ${contactPhone || "Not provided"}

View the listing: ${propertyUrl}
    `.trim(),

    html: layout({
      title: "Appointment confirmed",
      intro: `Hello ${buyerFirstName}, good news — your viewing request has been accepted.`,
      rows,
      footer: `See you then. View the listing again at <a href="${propertyUrl}" style="color:#7d2bc5;">${propertyUrl}</a>.`,
    }),
  };
};
