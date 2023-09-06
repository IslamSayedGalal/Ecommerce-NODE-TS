import axios from "axios";
import { SendSMSInterface } from "../types/sendSMS/SendSMS.interface";

const KEY = process.env.MITTO_API_KEY;

export const sendSMS = async (data: SendSMSInterface) => {
  const { from, to, text } = data;

  const options = {
    method: "POST",
    url: "https://rest.mittoapi.net/sms",
    headers: {
      "Content-Type": "application/json",
      "X-Mitto-API-Key": KEY,
    },
    data: {
      from: "asd",
      to: `${to}`,
      text,
    },
  };

  try {
    await axios.request(options);
    return true;
  } catch (error) {
    console.error(`${error}`.red);
    return false;
  }
};
