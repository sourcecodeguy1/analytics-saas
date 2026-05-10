<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function free(Request $request): JsonResponse
    {
        return response()->json([
            'metrics' => [
                ['label' => 'Total Users', 'value' => 1284, 'change' => '+12%'],
                ['label' => 'Active Sessions', 'value' => 342, 'change' => '+5%'],
                ['label' => 'Bounce Rate', 'value' => '38%', 'change' => '-2%'],
            ],
            'is_pro' => false,
        ]);
    }

    public function pro(Request $request): JsonResponse
    {
        if (!$request->user()->isPro()) {
            return response()->json(['message' => 'Pro subscription required.'], 403);
        }

        return response()->json([
            'metrics' => [
                ['label' => 'Total Users', 'value' => 1284, 'change' => '+12%'],
                ['label' => 'Active Sessions', 'value' => 342, 'change' => '+5%'],
                ['label' => 'Bounce Rate', 'value' => '38%', 'change' => '-2%'],
                ['label' => 'Revenue', 'value' => '$48,320', 'change' => '+18%'],
                ['label' => 'Conversion Rate', 'value' => '4.7%', 'change' => '+0.3%'],
                ['label' => 'Avg. Session Duration', 'value' => '3m 42s', 'change' => '+8%'],
            ],
            'chart_data' => [
                ['month' => 'Jan', 'users' => 800, 'revenue' => 32000],
                ['month' => 'Feb', 'users' => 950, 'revenue' => 37000],
                ['month' => 'Mar', 'users' => 1100, 'revenue' => 41000],
                ['month' => 'Apr', 'users' => 1284, 'revenue' => 48320],
            ],
            'reports' => [
                ['name' => 'Q1 Growth Report', 'date' => '2026-04-01', 'type' => 'PDF'],
                ['name' => 'User Acquisition', 'date' => '2026-03-15', 'type' => 'CSV'],
                ['name' => 'Revenue Breakdown', 'date' => '2026-03-01', 'type' => 'PDF'],
            ],
            'is_pro' => true,
        ]);
    }
}
