/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useMemo } from "react";
import { pools } from "@/lib/data/pools";
import Card from "@/components/ui/Card";

export function RecommendationEngine() {

  const optimalPoolSizes = useMemo(() => {
    const recommendations: Array<{
      pool: typeof pools[0];
      currentSize: number;
      recommendedSize: number;
      reason: string;
      savings: number;
    }> = [];

    pools.forEach((pool) => {
      const utilization = pool.utilization.percentage;
      const currentSize = pool.total_hosts;
      
      if (utilization < 30 && currentSize > 256) {
        const recommendedSize = Math.ceil(pool.utilization.allocated / 0.7); // Target 70% utilization
        recommendations.push({
          pool,
          currentSize,
          recommendedSize: Math.max(256, Math.ceil(recommendedSize / 256) * 256), // Round to /24
          reason: "Underutilized - can be downsized",
          savings: currentSize - Math.max(256, Math.ceil(recommendedSize / 256) * 256),
        });
      } else if (utilization > 85 && currentSize < 65536) {
        const recommendedSize = Math.ceil(pool.utilization.allocated / 0.7);
        recommendations.push({
          pool,
          currentSize,
          recommendedSize: Math.ceil(recommendedSize / 256) * 256, // Round to /24
          reason: "Overutilized - needs expansion",
          savings: 0,
        });
      }
    });

    return recommendations.sort((a, b) => b.savings - a.savings);
  }, []);

  const subnetRestructuring = useMemo(() => {
    const recommendations: Array<{
      action: string;
      description: string;
      pools: string[];
      benefit: string;
    }> = [];

    const privatePools = pools.filter((p) => p.type === "private" && p.utilization.percentage < 40);
    if (privatePools.length >= 2) {
      const totalCapacity = privatePools.reduce((sum, p) => sum + p.total_hosts, 0);
      const totalAllocated = privatePools.reduce((sum, p) => sum + p.utilization.allocated, 0);
      
      if (totalAllocated < totalCapacity * 0.5) {
        recommendations.push({
          action: "Merge Underutilized Pools",
          description: `Merge ${privatePools.length} private pools into fewer larger pools`,
          pools: privatePools.map((p) => p.cidr),
          benefit: `Free up ${Math.floor(totalCapacity * 0.3)} IPs for better allocation`,
        });
      }
    }

    const largePools = pools.filter((p) => p.total_hosts > 4096 && p.utilization.percentage > 60);
    if (largePools.length > 0) {
      recommendations.push({
        action: "Split Large Pools",
        description: "Split large pools into smaller subnets for better management",
        pools: largePools.map((p) => p.cidr),
        benefit: "Improved granularity and easier management",
      });
    }

    return recommendations;
  }, []);

  const reclaimOpportunities = useMemo(() => {
    const opportunities: Array<{
      type: string;
      description: string;
      estimatedIPs: number;
      pools: string[];
    }> = [];

    const expiredIPs = pools.reduce((sum, pool) => {
      return sum + Math.floor(pool.utilization.allocated * 0.1);
    }, 0);

    if (expiredIPs > 0) {
      opportunities.push({
        type: "Expired Allocations",
        description: "IPs with expired leases that can be reclaimed",
        estimatedIPs: expiredIPs,
        pools: pools
          .filter((p) => p.utilization.allocated > 0)
          .map((p) => p.cidr)
          .slice(0, 5),
      });
    }

    const reservedPools = pools.filter(
      (p) => p.utilization.reserved > p.utilization.allocated * 2 && p.utilization.reserved > 50
    );
    if (reservedPools.length > 0) {
      const reclaimable = reservedPools.reduce((sum, p) => sum + Math.floor(p.utilization.reserved * 0.3), 0);
      opportunities.push({
        type: "Excessive Reservations",
        description: "Pools with excessive reserved IPs that could be released",
        estimatedIPs: reclaimable,
        pools: reservedPools.map((p) => p.cidr),
      });
    }

    return opportunities;
  }, []);

  const costOptimization = useMemo(() => {
    const optimizations: Array<{
      category: string;
      recommendation: string;
      estimatedSavings: string;
      impact: "high" | "medium" | "low";
    }> = [];

    const underutilizedCount = pools.filter((p) => p.utilization.percentage < 25).length;
    if (underutilizedCount > 0) {
      optimizations.push({
        category: "Infrastructure Costs",
        recommendation: `Consolidate ${underutilizedCount} underutilized pools to reduce management overhead`,
        estimatedSavings: `~${underutilizedCount * 50}$/month`,
        impact: "medium",
      });
    }

    const overutilizedCount = pools.filter((p) => p.utilization.percentage > 90).length;
    if (overutilizedCount > 0) {
      optimizations.push({
        category: "Capacity Planning",
        recommendation: `Plan expansion for ${overutilizedCount} pools to avoid emergency procurement`,
        estimatedSavings: "Prevent 20-30% premium on emergency capacity",
        impact: "high",
      });
    }

    const totalReclaimable = reclaimOpportunities.reduce((sum, opp) => sum + opp.estimatedIPs, 0);
    if (totalReclaimable > 100) {
      optimizations.push({
        category: "Resource Utilization",
        recommendation: `Reclaim ${totalReclaimable} IPs to defer new capacity purchases`,
        estimatedSavings: `Defer ~${Math.ceil(totalReclaimable / 256) * 1000}$ in new pool costs`,
        impact: "high",
      });
    }

    return optimizations;
  }, [reclaimOpportunities]);

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Recommendation Engine</h3>
          <p className="text-sm text-slate-600">AI-powered recommendations for capacity optimization</p>
        </div>

        {optimalPoolSizes.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-slate-900 mb-3">Optimal Pool Sizes</h4>
            <div className="space-y-2">
              {optimalPoolSizes.slice(0, 5).map((rec, index) => (
                <div
                  key={rec.pool.id}
                  className="p-4 border border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-mono font-semibold text-slate-900">{rec.pool.cidr}</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                          {rec.reason}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Current: {rec.currentSize.toLocaleString()} → Recommended: {rec.recommendedSize.toLocaleString()}
                      </p>
                    </div>
                    {rec.savings > 0 && (
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600">Save {rec.savings.toLocaleString()} IPs</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {subnetRestructuring.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-slate-900 mb-3">Subnet Restructuring</h4>
            <div className="space-y-3">
              {subnetRestructuring.map((rec, index) => (
                <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="text-sm font-semibold text-slate-900 mb-1">{rec.action}</h5>
                  <p className="text-sm text-slate-600 mb-2">{rec.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {rec.pools.slice(0, 3).map((cidr) => (
                        <span key={cidr} className="px-2 py-0.5 bg-white text-slate-700 rounded text-xs font-mono">
                          {cidr}
                        </span>
                      ))}
                      {rec.pools.length > 3 && (
                        <span className="px-2 py-0.5 bg-white text-slate-500 rounded text-xs">
                          +{rec.pools.length - 3} more
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-blue-700 font-medium">{rec.benefit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {reclaimOpportunities.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-slate-900 mb-3">IP Reclaim Opportunities</h4>
            <div className="space-y-3">
              {reclaimOpportunities.map((opp, index) => (
                <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="text-sm font-semibold text-slate-900">{opp.type}</h5>
                      <p className="text-sm text-slate-600 mt-1">{opp.description}</p>
                    </div>
                    <span className="text-lg font-bold text-green-700">
                      ~{opp.estimatedIPs.toLocaleString()} IPs
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {opp.pools.slice(0, 3).map((cidr) => (
                      <span key={cidr} className="px-2 py-0.5 bg-white text-slate-700 rounded text-xs font-mono">
                        {cidr}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {costOptimization.length > 0 && (
          <div>
            <h4 className="text-md font-semibold text-slate-900 mb-3">Cost Optimization</h4>
            <div className="space-y-3">
              {costOptimization.map((opt, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    opt.impact === "high"
                      ? "bg-red-50 border-red-200"
                      : opt.impact === "medium"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-slate-900">{opt.category}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${
                            opt.impact === "high"
                              ? "bg-red-100 text-red-800"
                              : opt.impact === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {opt.impact.toUpperCase()} IMPACT
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">{opt.recommendation}</p>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-slate-700 mt-2">
                    Estimated Savings: {opt.estimatedSavings}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

