import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, userId } = await req.json();

    const response = await fetch(
      "https://api.flutterwave.com/v3/payments",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tx_ref: `crownx_${userId}_${Date.now()}`,
          amount: 9,
          currency: "USD",
          redirect_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
          customer: {
            email,
          },
          customizations: {
            title: "Crown X Pro",
            description: "Upgrade to Pro Plan",
          },
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      link: data.data.link,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}