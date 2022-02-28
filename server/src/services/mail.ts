import nodemailer from 'nodemailer';
import { serverConfiguration } from '../util/config.js';

function addressesIntoToField(addresses: string[]): string {
  return addresses.join(', ');
}


export async function sendHelloWorldEmail(addresses: string[]) {
  const to = addressesIntoToField(addresses);
  const transport = serverConfiguration.emailTransport;
  const result = await transport.sendMail({
    from: serverConfiguration.emailFromField,
    to,
    subject: "Hello",
    text: "Hello world in plain text!", // plain text body
    html: "<b>Hello world but bold!</b>", // html body
  });

  console.log("sent hello world.")
  console.log(result);

}
