<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\Checkout\Session;
use Stripe\Customer;
use Stripe\Stripe;

class SubscriptionController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function checkout(Request $request): JsonResponse
    {
        $request->validate([
            'plan' => 'required|in:monthly,annual',
        ]);

        $user = $request->user();

        if (!$user->stripe_customer_id) {
            $customer = Customer::create([
                'email' => $user->email,
                'name' => $user->name,
            ]);
            $user->update(['stripe_customer_id' => $customer->id]);
        }

        $priceId = $request->plan === 'annual'
            ? config('services.stripe.annual_price_id')
            : config('services.stripe.monthly_price_id');

        $session = Session::create([
            'customer' => $user->stripe_customer_id,
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price' => $priceId,
                'quantity' => 1,
            ]],
            'mode' => 'subscription',
            'success_url' => config('app.frontend_url') . '/dashboard?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => config('app.frontend_url') . '/pricing',
            'metadata' => [
                'user_id' => $user->id,
                'plan' => $request->plan,
            ],
        ]);

        return response()->json(['url' => $session->url]);
    }

    public function cancel(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->stripe_subscription_id) {
            return response()->json(['message' => 'No active subscription found.'], 404);
        }

        $subscription = \Stripe\Subscription::update($user->stripe_subscription_id, [
            'cancel_at_period_end' => true,
        ]);

        $endsAt = $subscription->current_period_end
            ? now()->setTimestamp($subscription->current_period_end)
            : null;

        $user->update(['subscription_ends_at' => $endsAt]);

        return response()->json([
            'message' => 'Subscription canceled successfully.',
            'ends_at' => $endsAt?->toFormattedDateString() ?? 'the end of your billing period',
        ]);
    }

    public function status(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'subscription_status' => $user->subscription_status,
            'subscription_plan' => $user->subscription_plan,
            'subscription_ends_at' => $user->subscription_ends_at,
            'is_pro' => $user->isPro(),
        ]);
    }
}
