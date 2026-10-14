import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { BlockId } from "./blockRegistry";
import { colors, MetricCard } from "../components";

import { AuthLoginBlock } from "../blocks/AuthLoginBlock";
import { SignUpBlock } from "../blocks/SignUpBlock";
import { ForgotPasswordBlock } from "../blocks/ForgotPasswordBlock";
import { TwoFactorAuthBlock } from "../blocks/TwoFactorAuthBlock";
import { AppShellBlock } from "../blocks/AppShellBlock";
import { TopNavHeaderBlock } from "../blocks/TopNavHeaderBlock";
import { DrawerNavBlock } from "../blocks/DrawerNavBlock";
import { OrgTenantSwitcherBlock } from "../blocks/OrgTenantSwitcherBlock";
import { KpiMetricGridBlock } from "../blocks/KpiMetricGridBlock";
import { DashboardAnalyticsBlock } from "../blocks/DashboardAnalyticsBlock";
import { ActivityTimelineBlock } from "../blocks/ActivityTimelineBlock";
import { RecordListBlock } from "../blocks/RecordListBlock";
import { BatchBulkActionsBlock } from "../blocks/BatchBulkActionsBlock";
import { FilterBottomSheetBlock } from "../blocks/FilterBottomSheetBlock";
import { RecordDetailHeaderBlock } from "../blocks/RecordDetailHeaderBlock";
import { RecordSummaryBlock } from "../blocks/RecordSummaryBlock";
import { TabbedRecordViewBlock } from "../blocks/TabbedRecordViewBlock";
import { CommentsNotesBlock } from "../blocks/CommentsNotesBlock";
import { RelatedRecordsBlock } from "../blocks/RelatedRecordsBlock";
import { MultiStepWizardBlock } from "../blocks/MultiStepWizardBlock";
import { SectionedFormBlock } from "../blocks/SectionedFormBlock";
import { LineItemsBlock } from "../blocks/LineItemsBlock";
import { StickyActionFooterBlock } from "../blocks/StickyActionFooterBlock";
import { KanbanPipelineBlock } from "../blocks/KanbanPipelineBlock";
import { StageProgressionBlock } from "../blocks/StageProgressionBlock";
import { FileManagerBlock } from "../blocks/FileManagerBlock";
import { EmailComposerBlock } from "../blocks/EmailComposerBlock";
import { InvoiceQuoteBuilderBlock } from "../blocks/InvoiceQuoteBuilderBlock";
import { OrderFulfillmentBlock } from "../blocks/OrderFulfillmentBlock";
import { UserTeamManagementBlock } from "../blocks/UserTeamManagementBlock";
import { BillingSubscriptionBlock } from "../blocks/BillingSubscriptionBlock";
import { DataExportShareBlock } from "../blocks/DataExportShareBlock";
import { EmptyStateBlock } from "../blocks/EmptyStateBlock";
import { ErrorStateBlock } from "../blocks/ErrorStateBlock";
import { GSTINInput } from "../blocks/GSTINInput";
import { UPIQR } from "../blocks/UPIQR";
import { EInvoiceQR } from "../blocks/EInvoiceQR";
import { ChequeFields, ChequeData } from "../blocks/ChequeFields";
import { PaymentStatusPoller } from "../blocks/PaymentStatusPoller";
import { SalarySlipItem } from "../blocks/SalarySlipItem";
import { ExpenseClaimSummary } from "../blocks/ExpenseClaimSummary";
import { EmployeeCheckinItem } from "../blocks/EmployeeCheckinItem";
import { EmployeeAdvanceBalance } from "../blocks/EmployeeAdvanceBalance";
import { OrderCart, CartItem } from "../blocks/OrderCart";
import { StockSummary } from "../blocks/StockSummary";
import { SuggestedOrderStrip } from "../blocks/SuggestedOrderStrip";
import { BinScanConfirm } from "../blocks/BinScanConfirm";
import { TripBoard } from "../blocks/TripBoard";
import { TripHeader } from "../blocks/TripHeader";
import { TrackingStatusBar } from "../blocks/TrackingStatusBar";
import { StopHeader } from "../blocks/StopHeader";
import { TicketStats } from "../blocks/TicketStats";
import { WorkflowActionSheet } from "../blocks/WorkflowActionSheet";

export function BlockExample({
  id,
  accent = colors.lime,
}: {
  id: BlockId;
  accent?: string;
}) {
  const [notice, setNotice] = useState("");
  const [bulkCount, setBulkCount] = useState(4);
  const [changeCount, setChangeCount] = useState(3);
  const [shellPage, setShellPage] = useState("overview");
  const [gstinValue, setGstinValue] = useState("29AABCU9603R1ZM");
  const [chequeState, setChequeState] = useState<ChequeData>({
    bankName: "State Bank of India",
    chequeNumber: "004812",
    ifscCode: "SBIN0001234",
    chequeDate: "2026-10-15",
    amount: "50,000.00",
    status: "cleared",
    drawerAccount: "30291049102",
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: "1",
      sku: "BRG-6204",
      name: "Deep Groove Ball Bearing 6204",
      unitPrice: 420,
      quantity: 15,
      unit: "pcs",
    },
    {
      id: "2",
      sku: "HYD-HSE-05",
      name: 'Industrial Hydraulic Hose 1/2"',
      unitPrice: 1250,
      quantity: 4,
      unit: "m",
    },
    {
      id: "3",
      sku: "VLV-PNEU-1",
      name: "Pneumatic Solenoid Valve 24V",
      unitPrice: 2800,
      quantity: 2,
      unit: "pcs",
    },
  ]);

  const renderContent = () => {
    switch (id) {
      case "auth-login":
        return (
          <AuthLoginBlock
            accent={accent}
            onLogin={(email) => setNotice(`Sign-in submitted for ${email}`)}
            onForgotPassword={() => setNotice("Password reset requested")}
            onSignUp={() => setNotice("Registration requested")}
          />
        );

      case "sign-up":
        return (
          <SignUpBlock
            accent={accent}
            onSignUp={(data) =>
              setNotice(`Registration submitted for ${data.name}`)
            }
            onLogin={() => setNotice("Sign-in requested")}
          />
        );

      case "forgot-password":
        return (
          <ForgotPasswordBlock
            accent={accent}
            onSubmit={(email) => setNotice(`Reset requested for ${email}`)}
            onBackToLogin={() => setNotice("Sign-in requested")}
          />
        );

      case "two-factor":
        return (
          <TwoFactorAuthBlock
            accent={accent}
            onVerify={() => setNotice("Verification submitted")}
            onResend={() => setNotice("New verification code requested")}
          />
        );

      case "app-shell":
        return (
          <AppShellBlock
            accent={accent}
            activeId={shellPage}
            onNavigate={setShellPage}
            userName="Alex Chen"
          >
            {shellPage === "overview" ? (
              <MetricCard
                title="Weekly progress"
                value="78%"
                change="+12%"
                points={[
                  { label: "Mon", value: 30 },
                  { label: "Tue", value: 45 },
                  { label: "Wed", value: 78 },
                ]}
                accent={accent}
              />
            ) : (
              <EmptyStateBlock
                compact
                title={
                  shellPage === "projects"
                    ? "No projects yet"
                    : shellPage === "customers"
                      ? "No customers yet"
                      : "No preferences configured"
                }
                description=""
                icon={shellPage === "settings" ? "settings" : "folder"}
                accent={accent}
              />
            )}
          </AppShellBlock>
        );

      case "top-nav":
        return (
          <TopNavHeaderBlock
            accent={accent}
            workspaceName="Design workspace"
            userName="Alex Chen"
            onSearch={(query) => setNotice(query ? `Search: ${query}` : "")}
          />
        );

      case "drawer-nav":
        return (
          <DrawerNavBlock
            accent={accent}
            onSelect={(itemId) => setNotice(`Navigated to: ${itemId}`)}
          />
        );

      case "tenant-switcher":
        return (
          <OrgTenantSwitcherBlock
            accent={accent}
            onSwitchTenant={(tenant) =>
              setNotice(`Switched active workspace to: ${tenant.name}`)
            }
          />
        );

      case "kpi-grid":
        return <KpiMetricGridBlock accent={accent} />;

      case "dashboard-analytics":
        return <DashboardAnalyticsBlock accent={accent} />;

      case "activity-timeline":
        return <ActivityTimelineBlock accent={accent} />;

      case "record-list":
        return <RecordListBlock accent={accent} pageSize={3} />;

      case "bulk-actions":
        return (
          <BatchBulkActionsBlock
            selectedCount={bulkCount}
            accent={accent}
            onExport={() => setNotice("Batch export triggered for 4 items")}
            onDelete={() => setNotice("Batch delete requested")}
            onChangeStatus={() => setNotice("Batch status update triggered")}
            onClearSelection={() => {
              setBulkCount(0);
              setNotice("Selection cleared");
            }}
          />
        );

      case "filter-bottomsheet":
        return (
          <FilterBottomSheetBlock
            inline={true}
            accent={accent}
            onApply={(f) =>
              setNotice(
                `Applied filters: ${f.selectedStatus.join(", ")} (max budget: $${f.maxBudget.toLocaleString()})`,
              )
            }
          />
        );

      case "record-header":
        return (
          <RecordDetailHeaderBlock
            accent={accent}
            onEdit={() => setNotice("Edit requested")}
            onDelete={() => setNotice("Delete confirmed")}
            onShare={() => setNotice("Share requested")}
          />
        );

      case "record-summary":
        return <RecordSummaryBlock accent={accent} />;

      case "tabbed-record":
        return <TabbedRecordViewBlock accent={accent} />;

      case "comments-notes":
        return <CommentsNotesBlock accent={accent} />;

      case "related-records":
        return (
          <RelatedRecordsBlock
            accent={accent}
            onLinkRecord={() => setNotice("Link record requested")}
          />
        );

      case "multi-step-wizard":
        return (
          <MultiStepWizardBlock
            accent={accent}
            onComplete={(data) =>
              setNotice(`Project settings submitted for ${data.projectName}`)
            }
          />
        );

      case "sectioned-form":
        return (
          <SectionedFormBlock
            accent={accent}
            initialProfile={{
              fullName: "Alex Chen",
              handle: "alexchen",
              bio: "Product designer",
            }}
            onSave={(data) =>
              setNotice(`Profile submitted for ${data.fullName}`)
            }
          />
        );

      case "line-items":
        return <LineItemsBlock accent={accent} />;

      case "sticky-action-footer":
        return (
          <StickyActionFooterBlock
            accent={accent}
            changeCount={changeCount}
            onSave={() => {
              setChangeCount(0);
              setNotice("Save requested");
            }}
            onDiscard={() => {
              setChangeCount(0);
              setNotice("Local changes discarded");
            }}
          />
        );

      case "kanban-board":
        return <KanbanPipelineBlock accent={accent} />;

      case "stage-progression":
        return <StageProgressionBlock accent={accent} />;

      case "file-manager":
        return <FileManagerBlock accent={accent} />;

      case "email-composer":
        return (
          <EmailComposerBlock
            accent={accent}
            onSend={(data) =>
              setNotice(
                `Message submitted for ${data.recipient}: "${data.subject}"`,
              )
            }
          />
        );

      case "invoice-builder":
        return (
          <InvoiceQuoteBuilderBlock
            accent={accent}
            onSendInvoice={(draft) =>
              setNotice(
                `Invoice ${draft.invoiceNumber} submitted for ${draft.client}`,
              )
            }
          />
        );

      case "order-fulfillment":
        return (
          <OrderFulfillmentBlock
            accent={accent}
            currentStep={2}
            carrier="Example carrier"
            trackingNumber="DEMO-9412"
            estimatedDelivery="October 18"
            items={[{ name: "Notebook", quantity: 2 }]}
            onTrack={() => setNotice("Tracking requested for DEMO-9412")}
          />
        );

      case "team-management":
        return (
          <UserTeamManagementBlock
            accent={accent}
            onInvite={() => setNotice("Invitation requested")}
          />
        );

      case "billing-subscription":
        return (
          <BillingSubscriptionBlock
            accent={accent}
            paymentMethod="Visa ending in 4242"
            invoices={[
              {
                id: "INV-001",
                date: "October 1, 2026",
                amount: "$24.00",
                status: "Paid",
              },
            ]}
            onDownloadInvoice={(invoice) =>
              setNotice(`Download requested for ${invoice.id}`)
            }
            onUpgrade={() => setNotice("Upgrade plan flow initiated")}
            onUpdateCard={() => setNotice("Payment method update requested")}
          />
        );

      case "data-export":
        return (
          <DataExportShareBlock
            totalRecords={120}
            filteredRecords={24}
            selectedRecords={3}
            accent={accent}
            onExport={(fmt, scp, flds) =>
              setNotice(
                `Export requested: ${flds.length} fields in ${fmt.toUpperCase()} format (${scp} scope)`,
              )
            }
          />
        );

      case "empty-state":
        return (
          <EmptyStateBlock
            accent={accent}
            title="No orders yet"
            description="Create an order or import your existing records."
            actionLabel="Create order"
            secondaryLabel="Import spreadsheet"
            onAction={() => setNotice("Triggered create order")}
            onSecondaryAction={() => setNotice("Import requested")}
          />
        );

      case "error-state":
        return (
          <ErrorStateBlock
            code="404"
            title="Page not found"
            accent={accent}
            onHome={() => setNotice("Returned to workspace home")}
            onRetry={() => setNotice("Retried network fetch")}
            onSupport={() => setNotice("Support requested")}
          />
        );

      case "gstin-input":
        return (
          <GSTINInput
            value={gstinValue}
            onChange={(g) => {
              setGstinValue(g);
              setNotice(`GSTIN updated: ${g}`);
            }}
          />
        );

      case "upi-qr":
        return (
          <UPIQR onPayNow={() => setNotice("Triggered UPI deep link intent")} />
        );

      case "einvoice-qr":
        return (
          <EInvoiceQR
            onVerify={() => setNotice("NIC signature verification requested")}
            onDownloadJSON={() =>
              setNotice("Downloading signed e-invoice JSON")
            }
          />
        );

      case "cheque-fields":
        return (
          <ChequeFields
            value={chequeState}
            onChange={(c) => {
              setChequeState(c);
              setNotice(`Cheque status: ${c.status}`);
            }}
          />
        );

      case "payment-poller":
        return (
          <PaymentStatusPoller
            status="polling"
            onRetry={() => setNotice("Retrying gateway poll...")}
            onCancel={() => setNotice("Cancelled payment verification")}
          />
        );

      case "salary-slip":
        return (
          <SalarySlipItem
            onDownloadPDF={() => setNotice("Generating payslip PDF...")}
          />
        );

      case "expense-claim":
        return (
          <ExpenseClaimSummary
            onApprove={() =>
              setNotice("Expense claim approved for reimbursement")
            }
            onReject={() => setNotice("Expense claim returned to employee")}
            onViewReceipts={() => setNotice("Receipt viewer modal opened")}
          />
        );

      case "employee-checkin":
        return <EmployeeCheckinItem />;

      case "employee-advance":
        return <EmployeeAdvanceBalance />;

      case "order-cart":
        return (
          <OrderCart
            items={cartItems}
            showPeekBar
            onUpdateQuantity={(id, qty) =>
              setCartItems((prev) =>
                prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
              )
            }
            onRemoveItem={(id) =>
              setCartItems((prev) => prev.filter((i) => i.id !== id))
            }
            onCheckout={() => setNotice("Proceeding to dispatch & billing")}
          />
        );

      case "stock-summary":
        return (
          <StockSummary
            onInitiateReorder={() =>
              setNotice("Created reorder purchase requisition")
            }
          />
        );

      case "suggested-order":
        return (
          <SuggestedOrderStrip
            onAccept={() => setNotice("Added 400 units to Purchase Order")}
            onDismiss={() => setNotice("Suggested order dismissed")}
          />
        );

      case "bin-scan":
        return (
          <BinScanConfirm
            onConfirm={() =>
              setNotice("Bin putaway confirmed. Advancing to next pick.")
            }
            onRescan={() => setNotice("Camera barcode scanner activated")}
          />
        );

      case "trip-board":
        return (
          <TripBoard
            onSelectTrip={(t) =>
              setNotice(`Selected Trip ${t.tripNumber} (${t.driverName})`)
            }
            onCreateTrip={() => setNotice("Opening new trip dispatch wizard")}
          />
        );

      case "trip-header":
        return (
          <TripHeader
            onCallDriver={() => setNotice("Dialing driver phone...")}
            onViewGPS={() => setNotice("Opening telematics live tracker")}
            onViewManifest={() =>
              setNotice("Viewing trip consignment manifest")
            }
          />
        );

      case "tracking-status":
        return <TrackingStatusBar />;

      case "stop-header":
        return (
          <StopHeader
            onCall={() => setNotice("Calling consignee...")}
            onNavigate={() => setNotice("Launching turn-by-turn navigation")}
            onComplete={() => setNotice("Stop delivery completed and signed")}
          />
        );

      case "ticket-stats":
        return <TicketStats />;

      case "workflow-sheet":
        return (
          <WorkflowActionSheet
            onExecuteAction={(type, notes) =>
              setNotice(
                `Workflow executed: ${type} (Notes: ${notes || "None"})`,
              )
            }
            onCancel={() => setNotice("Action cancelled")}
          />
        );

      default:
        return (
          <View style={s.placeholderCard}>
            <Text style={s.placeholderTitle}>Block preview</Text>
            <Text style={s.placeholderSub}>Block {id} preview ready</Text>
          </View>
        );
    }
  };

  return (
    <View style={s.blockWrapper}>
      {renderContent()}
      {notice ? (
        <Text accessibilityLiveRegion="polite" style={s.notice}>
          {notice}
        </Text>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  blockWrapper: {
    width: "100%",
    alignItems: "center",
  },
  notice: {
    fontSize: 12,
    color: colors.ink,
    backgroundColor: colors.canvas,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.line,
    marginTop: 12,
    textAlign: "center",
  },
  placeholderCard: {
    padding: 24,
    backgroundColor: colors.paper,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  placeholderTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.ink,
  },
  placeholderSub: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 4,
  },
});
