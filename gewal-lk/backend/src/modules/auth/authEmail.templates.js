const createEmailLayout = ({
  title,
  greeting,
  message,
  otp,
  expiryMinutes,
}) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>${title}</title>
      </head>

      <body
        style="
          margin: 0;
          padding: 0;
          background: #f4f4f7;
          font-family: Arial, Helvetica, sans-serif;
          color: #242424;
        "
      >
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
        >
          <tr>
            <td align="center" style="padding: 40px 15px;">
              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="
                  max-width: 600px;
                  background: #ffffff;
                  border-radius: 12px;
                  overflow: hidden;
                "
              >
                <tr>
                  <td
                    style="
                      background: #9949df;
                      padding: 24px;
                      text-align: center;
                    "
                  >
                    <h1
                      style="
                        margin: 0;
                        color: #ffffff;
                        font-size: 28px;
                      "
                    >
                      Gewal.lk
                    </h1>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 32px;">
                    <h2
                      style="
                        margin-top: 0;
                        font-size: 22px;
                      "
                    >
                      ${title}
                    </h2>

                    <p>${greeting}</p>

                    <p
                      style="
                        line-height: 1.6;
                        color: #555555;
                      "
                    >
                      ${message}
                    </p>

                    <div
                      style="
                        margin: 30px 0;
                        padding: 20px;
                        text-align: center;
                        background: #f4eafd;
                        border-radius: 10px;
                      "
                    >
                      <span
                        style="
                          font-size: 34px;
                          font-weight: bold;
                          letter-spacing: 8px;
                          color: #7d2bc5;
                        "
                      >
                        ${otp}
                      </span>
                    </div>

                    <p
                      style="
                        color: #666666;
                        line-height: 1.6;
                      "
                    >
                      This code expires in
                      <strong>${expiryMinutes} minutes</strong>.
                    </p>

                    <p
                      style="
                        color: #666666;
                        line-height: 1.6;
                      "
                    >
                      Do not share this code with anyone.
                      Gewal.lk staff will never ask you for
                      this code.
                    </p>

                    <p
                      style="
                        color: #888888;
                        font-size: 13px;
                        line-height: 1.5;
                      "
                    >
                      If you did not make this request, you
                      can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <tr>
                  <td
                    style="
                      background: #f8f8fa;
                      padding: 20px;
                      text-align: center;
                      font-size: 12px;
                      color: #888888;
                    "
                  >
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
};

export const emailVerificationTemplate = ({
  firstName,
  otp,
  expiryMinutes,
}) => {
  return {
    subject: "Verify your Gewal.lk email address",

    text: `
Hello ${firstName},

Your Gewal.lk email verification code is: ${otp}

This code expires in ${expiryMinutes} minutes.

Do not share this code with anyone.
    `.trim(),

    html: createEmailLayout({
      title: "Verify your email address",
      greeting: `Hello ${firstName},`,
      message:
        "Use the following verification code to activate your Gewal.lk account.",
      otp,
      expiryMinutes,
    }),
  };
};

export const passwordResetTemplate = ({
  firstName,
  otp,
  expiryMinutes,
}) => {
  return {
    subject: "Reset your Gewal.lk password",

    text: `
Hello ${firstName},

Your Gewal.lk password reset code is: ${otp}

This code expires in ${expiryMinutes} minutes.

If you did not request this reset, ignore this email.
    `.trim(),

    html: createEmailLayout({
      title: "Reset your password",
      greeting: `Hello ${firstName},`,
      message:
        "Use the following verification code to continue resetting your Gewal.lk password.",
      otp,
      expiryMinutes,
    }),
  };
};