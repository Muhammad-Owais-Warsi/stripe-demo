import express from "express"
import cors from "cors"
import { BetterPay } from "better-pay"
import * as dotenv from "dotenv"
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const provider = new BetterPay({
  provider: 'stripe',
  apiKey: process.env.STRIPE_SECRET_KEY
})

app.post("/create", async(req, res) => {
  const { amount, currency } = req.body;

  const resp = await provider.createPayment({
    amount: amount,
    currency: currency
  })
  res.json(resp);
})

app.post("/confirm", async(req, res) => {

  const {paymentIntentId ,paymentMethodId, returnUrl } = req.body;
  const resp = await provider.confirmPayment(
    {
      paymentIntentId: paymentIntentId,
      paymentMethodId: paymentMethodId,
      returnUrl: returnUrl
    }
  )

  res.json(resp);
})

app.listen(4000, () => {
  console.log("running");
})