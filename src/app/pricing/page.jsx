import { Stripe } from "stripe";
import ButtonCheckout from "@/components/ButtonCheckout";

async function loadPrices() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const prices = await stripe.prices.list();
  const sortedPrices = prices.data.sort(
    (a, b) => a.unit_amount - b.unit_amount
  );
  return sortedPrices;
}

async function loadImage(productId) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const product = await stripe.products.retrieve(productId);
  return product.images[0];
}

async function loadImagesForPrices(prices) {
  const imagePromises = prices.map((price) => loadImage(price.product));
  return Promise.all(imagePromises);
}

async function PricingPage() {
  const prices = await loadPrices();
  const images = await loadImagesForPrices(prices);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="flex gap-x-2 bg-slate-400 rounded">
        {prices.map((price, index) => (
          <div key={price.product} className="bg-slate-300 mb-2 p-7">
            <h3>{price.nickname}</h3>
            <img src={images[index]} alt="" />
            <h2 className="text-3xl font-bold">{price.unit_amount / 100}$</h2>
            <ButtonCheckout priceId={price.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default PricingPage;
