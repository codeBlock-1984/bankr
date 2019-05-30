const getMailBody = (transactionDetails) => {
  const {
    id, type, accountNumber, amount, balance, firstname, lastname, date,
  } = transactionDetails;

  const transactionDate = date.toString();

  return `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport"
             content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>Bankr</title>
            <style>
              * {
                box-sizing: border-box;
              }
            html, body{
              height: 100vh;
            }
            body {
              padding: 0;
              margin: 0;
              color: #0000;
            }
            
            .mail-box {
              display: flex;
              flex-direction: column;
              flex-wrap: nowrap;
              justify-content: center;
            }
            .msg-title {
              color: #8dc465;
            }
            
            </style>
          </head>
          <body>
            <div class="mail-box">
              <p>Dear ${firstname} &nbsp; ${lastname},</p>
              <h2 class="msg-title">Transaction Notification</h2>
              <p>
                We wish to notify you of a ${type}
                transaction on your account.
              </p>
              <p>Transaction details are as follows:</p>
              <br>
              <table>
                <tr>
                  <th>Account number:</th>
                  <td>&nbsp;${accountNumber}</td>
                </tr>
                <tr>
                  <th>Amount:</th>
                  <td>&nbsp;${amount}</td>
                </tr>
                <tr>
                  <th>Date:</th>
                  <td>&nbsp;${transactionDate}</td>
                </tr>
                <tr>
                  <th>Transaction ID:</th>
                  <td>&nbsp;${id}</td>
                </tr>
                <tr>
                  <th>Current balance:</th>
                  <td>&nbsp;${balance}</td>
                </tr>
              </table>
              <br>
              <br>
              <p>Thank you for choosing Bankr.</p>
            </div>
          </body>
          </html>`;
};

export default getMailBody;
