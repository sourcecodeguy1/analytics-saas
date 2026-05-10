<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
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
        } catch (\Exception $e) {
            return response($e->getMessage(), 400);
        }

        match ($event->type) {
            'checkout.session.completed' => $this->handleCheckoutCompleted($event->data->object),
            'customer.subscription.deleted' => $this->handleSubscriptionDeleted($event->data->object),
            'customer.subscription.updated' => $this->handleSubscriptionUpdated($event->data->object),
            default => null,
        };

        return response('OK', 200);
    }

    private function handleCheckoutCompleted(object $session): void
    {
        $user = User::find($session->metadata->user_id);

        if (!$user) {
            return;
        }

        $user->update([
            'stripe_subscription_id' => $session->subscription,
            'subscription_plan' => $session->metadata->plan,
            'subscription_status' => 'active',
        ]);
    }

    private function handleSubscriptionDeleted(object $subscription): void
    {
        $user = User::where('stripe_subscription_id', $subscription->id)->first();

        if (!$user) {
            return;
        }

        $user->update([
            'subscription_status' => 'canceled',
            'subscription_ends_at' => now()->timestamp($subscription->current_period_end),
        ]);
    }

    private function handleSubscriptionUpdated(object $subscription): void
    {
        $user = User::where('stripe_subscription_id', $subscription->id)->first();

        if (!$user) {
            return;
        }

        $activeStatuses = ['active', 'trialing'];
        $status = in_array($subscription->status, $activeStatuses) ? 'active' : 'canceled';

        $user->update(['subscription_status' => $status]);
    }
}
