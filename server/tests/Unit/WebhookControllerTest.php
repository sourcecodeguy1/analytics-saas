<?php

namespace Tests\Unit;

use App\Http\Controllers\Api\WebhookController;
use PHPUnit\Framework\TestCase;

class WebhookControllerTest extends TestCase
{
    private WebhookController $controller;

    protected function setUp(): void
    {
        $this->controller = new WebhookController();
    }

    public function test_active_status_maps_to_active(): void
    {
        $this->assertSame('active', $this->controller->mapStripeStatus('active'));
    }

    public function test_trialing_status_maps_to_active(): void
    {
        $this->assertSame('active', $this->controller->mapStripeStatus('trialing'));
    }

    public function test_past_due_status_maps_to_past_due(): void
    {
        $this->assertSame('past_due', $this->controller->mapStripeStatus('past_due'));
    }

    public function test_unpaid_status_maps_to_past_due(): void
    {
        $this->assertSame('past_due', $this->controller->mapStripeStatus('unpaid'));
    }

    public function test_canceled_status_maps_to_free(): void
    {
        $this->assertSame('free', $this->controller->mapStripeStatus('canceled'));
    }

    public function test_unknown_status_maps_to_free(): void
    {
        $this->assertSame('free', $this->controller->mapStripeStatus('something_unexpected'));
    }
}
