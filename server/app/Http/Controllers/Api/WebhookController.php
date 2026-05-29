<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Stripe;
use Stripe\Webhook;

class WebhookController extends Controller
{
    public function handle(Request $request): Response
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (SignatureVerificationException $e) {
            return response('Invalid signature', 400);
        }

        $data = $event->data->object;

        match ($event->type) {
            'checkout.session.completed' => $this->handleCheckoutCompleted($data),
            'customer.subscription.updated' => $this->handleSubscriptionUpdated($data),
            'customer.subscription.deleted' => $this->handleSubscriptionDeleted($data),
            default => null,
        };

        return response('OK', 200);
    }

    private function handleCheckoutCompleted(object $session): void
    {
        $user = User::where('stripe_customer_id', $session->customer)->first();

        if (!$user) {
            return;
        }

        $user->update([
            'subscription_status' => 'active',
            'subscription_plan' => $session->metadata->plan ?? 'monthly',
            'stripe_subscription_id' => $session->subscription,
        ]);
    }

    private function handleSubscriptionDeleted(object $subscription): void
    {
        $user = User::where('stripe_subscription_id', $subscription->id)->first();

        if (!$user) {
            return;
        }

        $endsAt = $subscription->current_period_end
            ? now()->setTimestamp($subscription->current_period_end)
            : null;

        $user->update([
            'subscription_status' => 'free',
            'subscription_plan' => null,
            'stripe_subscription_id' => null,
            'subscription_ends_at' => $endsAt,
        ]);
    }

    private function handleSubscriptionUpdated(object $subscription): void
    {
        $user = User::where('stripe_subscription_id', $subscription->id)->first();

        if (!$user) {
            return;
        }

        $status = $this->mapStripeStatus($subscription->status);

        $user->update([
            'subscription_status' => $status,
            'subscription_plan' => $status === 'active' ? ($user->subscription_plan ?? 'monthly') : null,
        ]);
    }

    public function mapStripeStatus(string $status): string
    {
        return match ($status) {
            'active', 'trialing' => 'active',
            'past_due', 'unpaid' => 'past_due',
            'canceled' => 'free',
            default => 'free',
        };
    }
}
