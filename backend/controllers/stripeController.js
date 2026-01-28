const redis = require("../config/redisClient");
const stripeClient = require("../config/stripe");
const BookingsModel = require("../models/Bookings");
const ShowModel = require("../models/Show");

const createCheckoutSession = async (req, res, next) => {
  try {
    const { seats, showId } = req.body;

    const show = await ShowModel.findById(showId);
    let totalAmount = 0;

    seats.forEach((seat) => {
      const seatRow = seat[0];
      const price = show.pricing[seatRow];
      totalAmount += price;
    });

    const lockedKey = `locked_seats:${showId}`;
    const availableKey = `available_seats:${showId}`;

    const booking = await BookingsModel.create({
      showId,
      seats,
      amount: totalAmount,
    });
    await redis.sRem(availableKey, seats);
    await redis.sRem(lockedKey, seats);

    const lineItems = seats.map((seat) => {
      const seatRow = seat[0];
      const price = show.pricing[seatRow];

      let imageUrl = show.posterUrl;
      if (imageUrl && imageUrl.startsWith("/")) {
         imageUrl = `${req.protocol}://${req.get("host")}${imageUrl}`;
      }

      return {
        price_data: {
          currency: "inr",
          unit_amount: price * 100,
          product_data: {
            name: `${show.title} - ${seat}`,
            images: [imageUrl],
          },
        },
        quantity: 1,
      };
    });

    const session = await stripeClient.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `http://localhost:5173/?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/?status=cancel`,
      metadata: { bookingId: booking._id.toString() },
    });

    booking.stripeSessionId = session.id;
    // store booking in DB
    await booking.save();
    res.send(session.url);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCheckoutSession,
};
