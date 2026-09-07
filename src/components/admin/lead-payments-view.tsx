import React from "react";
import { PaymentRecord, PaymentStatus } from "@/types/crm";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";

interface LeadPaymentsViewProps {
  payments: PaymentRecord[];
}

export function LeadPaymentsView({ payments }: LeadPaymentsViewProps) {
  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case "SUCCESS":
        return (
          <Badge className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Success</span>
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-red-50 text-red-700 border border-red-200 font-mono text-[10px] flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            <span>Failed</span>
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="bg-stone-100 text-stone-600 border border-stone-200 font-mono text-[10px] flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>Cancelled</span>
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-blue-50 text-blue-800 border border-blue-200 font-mono text-[10px] flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </Badge>
        );
      case "CREATED":
      default:
        return (
          <Badge className="bg-amber-50 text-amber-800 border border-amber-200 font-mono text-[10px] flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Order Created</span>
          </Badge>
        );
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-paper border border-ink/10 space-y-5 shadow-subtle">
      <div className="flex items-center justify-between pb-3 border-b border-ink/10">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-olive/10 text-olive-deep border border-olive/20">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-display font-medium text-ink">
              Payment & Enrollment Records
            </h3>
            <p className="text-xs text-ink-soft">
              Razorpay transaction logs and verified enrollment subscriptions
            </p>
          </div>
        </div>
        <span className="text-xs text-ink-soft font-mono">
          {payments.length} Records
        </span>
      </div>

      {payments.length === 0 ? (
        <div className="py-6 text-center text-ink-soft/70 border border-dashed border-ink/15 rounded-xl">
          <p className="text-xs">No checkout or payment transactions recorded for this lead yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-xl bg-ivory border border-ink/10 space-y-2.5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-ink font-mono">
                    ₹{p.amount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-ink/30">•</span>
                  <span className="text-xs font-semibold text-olive-deep">
                    Velocity {p.programTrack} ({p.supportTier} - {p.duration})
                  </span>
                </div>
                <div>{getStatusBadge(p.status)}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-2 border-t border-ink/10 text-ink-soft">
                <div>
                  <span>Order ID: </span>
                  <span className="font-mono text-ink">{p.gatewayOrderId}</span>
                </div>
                {p.gatewayPaymentId && (
                  <div>
                    <span>Payment ID: </span>
                    <span className="font-mono text-ink">{p.gatewayPaymentId}</span>
                  </div>
                )}
                <div>
                  <span>Initiated: </span>
                  <span className="text-ink font-mono">
                    {new Date(p.createdAt).toLocaleDateString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                </div>
                <div>
                  <span>Gateway: </span>
                  <span className="capitalize text-ink">{p.gateway}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
