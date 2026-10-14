import { IconName } from "../components";

export type BlockCategory =
  | "All blocks"
  | "Auth & Access"
  | "Navigation & Shell"
  | "Dashboard & Records"
  | "Forms & Workflows"
  | "Operations & Commerce"
  | "Feedback & States";

export type BlockId =
  | "auth-login"
  | "sign-up"
  | "forgot-password"
  | "two-factor"
  | "app-shell"
  | "top-nav"
  | "drawer-nav"
  | "tenant-switcher"
  | "kpi-grid"
  | "dashboard-analytics"
  | "activity-timeline"
  | "record-list"
  | "bulk-actions"
  | "filter-bottomsheet"
  | "record-header"
  | "record-summary"
  | "tabbed-record"
  | "comments-notes"
  | "related-records"
  | "multi-step-wizard"
  | "sectioned-form"
  | "line-items"
  | "sticky-action-footer"
  | "kanban-board"
  | "stage-progression"
  | "file-manager"
  | "email-composer"
  | "invoice-builder"
  | "order-fulfillment"
  | "team-management"
  | "billing-subscription"
  | "data-export"
  | "empty-state"
  | "error-state"
  | "gstin-input"
  | "upi-qr"
  | "einvoice-qr"
  | "cheque-fields"
  | "payment-poller"
  | "salary-slip"
  | "expense-claim"
  | "employee-checkin"
  | "employee-advance"
  | "order-cart"
  | "stock-summary"
  | "suggested-order"
  | "bin-scan"
  | "trip-board"
  | "trip-header"
  | "tracking-status"
  | "stop-header"
  | "ticket-stats"
  | "workflow-sheet";

export type BlockEntry = {
  id: BlockId;
  name: string;
  description: string;
  category: BlockCategory;
  icon: IconName;
  file: string;
  dependencies: string[];
  background: string;
  tag?: string;
  usage: string;
};

export const blockCategories: BlockCategory[] = [
  "All blocks",
  "Auth & Access",
  "Navigation & Shell",
  "Dashboard & Records",
  "Forms & Workflows",
  "Operations & Commerce",
  "Feedback & States",
];

export const blockRegistry: BlockEntry[] = [
  {
    id: "auth-login",
    name: "Authentication / login",
    description:
      "Sign-in form with validation, password visibility, and pending states.",
    category: "Auth & Access",
    icon: "lock",
    file: "AuthLoginBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#f4f3ed",
    tag: "Essential",
    usage: `import { AuthLoginBlock } from './blocks/AuthLoginBlock';\n\n<AuthLoginBlock onLogin={(email, pass) => console.log(email)} />`,
  },
  {
    id: "sign-up",
    name: "Sign-up / registration",
    description:
      "Registration form with password validation and terms confirmation.",
    category: "Auth & Access",
    icon: "users",
    file: "SignUpBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#f0f2eb",
    usage: `import { SignUpBlock } from './blocks/SignUpBlock';\n\n<SignUpBlock onSignUp={(data) => console.log(data)} />`,
  },
  {
    id: "forgot-password",
    name: "Forgot / reset password",
    description:
      "Email reset request with pending, error, and confirmation states.",
    category: "Auth & Access",
    icon: "mail",
    file: "ForgotPasswordBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#eef2f5",
    usage: `import { ForgotPasswordBlock } from './blocks/ForgotPasswordBlock';\n\n<ForgotPasswordBlock onSubmit={(email) => console.log(email)} />`,
  },
  {
    id: "two-factor",
    name: "Two-factor authentication (2FA)",
    description: "6-digit verification code input with countdown resend timer.",
    category: "Auth & Access",
    icon: "shield",
    file: "TwoFactorAuthBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#f3edf0",
    usage: `import { TwoFactorAuthBlock } from './blocks/TwoFactorAuthBlock';\n\n<TwoFactorAuthBlock onVerify={() => console.log('Verification requested')} onResend={() => console.log('Resend requested')} />`,
  },
  {
    id: "app-shell",
    name: "App shell / layout",
    description:
      "Responsive navigation shell with a configurable content area.",
    category: "Navigation & Shell",
    icon: "grid",
    file: "AppShellBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#edf1f1",
    tag: "Layout",
    usage: `import { AppShellBlock } from './blocks/AppShellBlock';\n\n<AppShellBlock title="Workspace" />`,
  },
  {
    id: "top-nav",
    name: "Top navigation header",
    description:
      "Workspace header with optional search, notifications, and user actions.",
    category: "Navigation & Shell",
    icon: "menu",
    file: "TopNavHeaderBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#f0edf3",
    usage: `import { TopNavHeaderBlock } from './blocks/TopNavHeaderBlock';\n\n<TopNavHeaderBlock workspaceName="Design workspace" onSearch={(query) => console.log(query)} />`,
  },
  {
    id: "drawer-nav",
    name: "Drawer navigation block",
    description: "Grouped navigation panel with active selection.",
    category: "Navigation & Shell",
    icon: "menu",
    file: "DrawerNavBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#edf2ec",
    usage: `import { DrawerNavBlock } from './blocks/DrawerNavBlock';\n\n<DrawerNavBlock />`,
  },
  {
    id: "tenant-switcher",
    name: "Organization / tenant switcher",
    description:
      "Organization selection with current workspace and pending feedback.",
    category: "Navigation & Shell",
    icon: "spark",
    file: "OrgTenantSwitcherBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#f2ece8",
    usage: `import { OrgTenantSwitcherBlock } from './blocks/OrgTenantSwitcherBlock';\n\n<OrgTenantSwitcherBlock />`,
  },
  {
    id: "kpi-grid",
    name: "KPI metric stat card grid",
    description:
      "Responsive 4-card metric grid with percentage trends and indicators.",
    category: "Dashboard & Records",
    icon: "chart",
    file: "KpiMetricGridBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#ebf2ee",
    tag: "Analytics",
    usage: `import { KpiMetricGridBlock } from './blocks/KpiMetricGridBlock';\n\n<KpiMetricGridBlock />`,
  },
  {
    id: "dashboard-analytics",
    name: "Dashboard analytics chart",
    description:
      "Analytics block with time filters, bar comparison, and breakdown.",
    category: "Dashboard & Records",
    icon: "chart",
    file: "DashboardAnalyticsBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#eaf0ed",
    usage: `import { DashboardAnalyticsBlock } from './blocks/DashboardAnalyticsBlock';\n\n<DashboardAnalyticsBlock />`,
  },
  {
    id: "activity-timeline",
    name: "Activity & audit trail timeline",
    description:
      "Chronological audit trail with event badges and actor avatars.",
    category: "Dashboard & Records",
    icon: "clock",
    file: "ActivityTimelineBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#f0f0ea",
    usage: `import { ActivityTimelineBlock } from './blocks/ActivityTimelineBlock';\n\n<ActivityTimelineBlock />`,
  },
  {
    id: "record-list",
    name: "Record list with filtering",
    description:
      "Searchable records with selection, pagination, and mobile card layout.",
    category: "Dashboard & Records",
    icon: "list" as any,
    file: "RecordListBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#edf1f4",
    tag: "Data",
    usage: `import { RecordListBlock } from './blocks/RecordListBlock';\n\n<RecordListBlock />`,
  },
  {
    id: "bulk-actions",
    name: "Batch / bulk actions toolbar",
    description:
      "Selection count and optional bulk actions with deletion confirmation.",
    category: "Dashboard & Records",
    icon: "layers",
    file: "BatchBulkActionsBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#f3edf0",
    usage: `import { BatchBulkActionsBlock } from './blocks/BatchBulkActionsBlock';\n\n<BatchBulkActionsBlock selectedCount={3} onExport={() => console.log('Export requested')} onDelete={() => console.log('Delete confirmed')} />`,
  },
  {
    id: "filter-bottomsheet",
    name: "Advanced filter bottomsheet",
    description:
      "Status, date, and budget filters with reset and apply actions.",
    category: "Dashboard & Records",
    icon: "filter",
    file: "FilterBottomSheetBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#eef2ec",
    usage: `import { FilterBottomSheetBlock } from './blocks/FilterBottomSheetBlock';\n\n<FilterBottomSheetBlock inline onApply={(filters) => console.log(filters)} />`,
  },
  {
    id: "record-header",
    name: "Record detail header",
    description:
      "Entity header with breadcrumb, status badge, and action buttons.",
    category: "Dashboard & Records",
    icon: "file",
    file: "RecordDetailHeaderBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#f0edf3",
    usage: `import { RecordDetailHeaderBlock } from './blocks/RecordDetailHeaderBlock';\n\n<RecordDetailHeaderBlock />`,
  },
  {
    id: "record-summary",
    name: "Record summary / key-value",
    description: "Owner, client, due date, contract value, and tags.",
    category: "Dashboard & Records",
    icon: "copy",
    file: "RecordSummaryBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#f4f0e8",
    usage: `import { RecordSummaryBlock } from './blocks/RecordSummaryBlock';\n\n<RecordSummaryBlock />`,
  },
  {
    id: "tabbed-record",
    name: "Tabbed record view",
    description:
      "Multi-tab interface switching between Overview, Activity, and Files.",
    category: "Dashboard & Records",
    icon: "layers",
    file: "TabbedRecordViewBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#eef1f4",
    usage: `import { TabbedRecordViewBlock } from './blocks/TabbedRecordViewBlock';\n\n<TabbedRecordViewBlock />`,
  },
  {
    id: "comments-notes",
    name: "Comments & notes thread",
    description:
      "Comment thread with optional internal notes and async posting.",
    category: "Dashboard & Records",
    icon: "mail",
    file: "CommentsNotesBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#f1edf5",
    usage: `import { CommentsNotesBlock } from './blocks/CommentsNotesBlock';\n\n<CommentsNotesBlock />`,
  },
  {
    id: "related-records",
    name: "Related records list",
    description:
      "Associated records card with linked items and quick add button.",
    category: "Dashboard & Records",
    icon: "layers",
    file: "RelatedRecordsBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#edf2ee",
    usage: `import { RelatedRecordsBlock } from './blocks/RelatedRecordsBlock';\n\n<RelatedRecordsBlock />`,
  },
  {
    id: "multi-step-wizard",
    name: "Multi-step form wizard",
    description: "Validated project setup with review and submission states.",
    category: "Forms & Workflows",
    icon: "checkCircle",
    file: "MultiStepWizardBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#f2ece8",
    tag: "Interactive",
    usage: `import { MultiStepWizardBlock } from './blocks/MultiStepWizardBlock';\n\n<MultiStepWizardBlock onComplete={(project) => console.log(project.projectName)} />`,
  },
  {
    id: "sectioned-form",
    name: "Sectioned form / fieldset",
    description: "Profile and settings form organized into distinct sections.",
    category: "Forms & Workflows",
    icon: "edit",
    file: "SectionedFormBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#eaf2eb",
    usage: `import { SectionedFormBlock } from './blocks/SectionedFormBlock';\n\n<SectionedFormBlock onSave={(profile) => console.log(profile.fullName)} />`,
  },
  {
    id: "line-items",
    name: "Line items repeating row entry",
    description:
      "Dynamic item row builder with quantity, unit price, and auto-sum.",
    category: "Forms & Workflows",
    icon: "dollar",
    file: "LineItemsBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#f0efe8",
    usage: `import { LineItemsBlock } from './blocks/LineItemsBlock';\n\n<LineItemsBlock />`,
  },
  {
    id: "sticky-action-footer",
    name: "Sticky action footer",
    description: "Unsaved changes with save feedback and discard confirmation.",
    category: "Forms & Workflows",
    icon: "check",
    file: "StickyActionFooterBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#edf0f4",
    usage: `import { StickyActionFooterBlock } from './blocks/StickyActionFooterBlock';\n\n<StickyActionFooterBlock changeCount={2} onSave={() => console.log('Save requested')} onDiscard={() => console.log('Discard confirmed')} />`,
  },
  {
    id: "kanban-board",
    name: "Kanban / pipeline board",
    description:
      "Task columns with explicit move actions and optional card creation.",
    category: "Forms & Workflows",
    icon: "grid",
    file: "KanbanPipelineBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#f4f1e6",
    tag: "Workflow",
    usage: `import { KanbanPipelineBlock } from './blocks/KanbanPipelineBlock';\n\n<KanbanPipelineBlock />`,
  },
  {
    id: "stage-progression",
    name: "Stage progression tracker",
    description:
      "Selectable pipeline stages with current and completed states.",
    category: "Forms & Workflows",
    icon: "arrowRight",
    file: "StageProgressionBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#eef2ec",
    usage: `import { StageProgressionBlock } from './blocks/StageProgressionBlock';\n\n<StageProgressionBlock initialStage={2} onStageChange={(stage) => console.log(stage.name)} />`,
  },
  {
    id: "file-manager",
    name: "File & attachment manager",
    description:
      "System file selection, category filters, and removal confirmation.",
    category: "Operations & Commerce",
    icon: "folder",
    file: "FileManagerBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#f3edf0",
    usage: `import { FileManagerBlock } from './blocks/FileManagerBlock';\n\n<FileManagerBlock onAddFiles={(files) => console.log(files.map(file => file.name))} />`,
  },
  {
    id: "email-composer",
    name: "Email composer & log",
    description:
      "Compose a message with document attachments and submission feedback.",
    category: "Operations & Commerce",
    icon: "send",
    file: "EmailComposerBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#eef1f4",
    usage: `import { EmailComposerBlock } from './blocks/EmailComposerBlock';\n\n<EmailComposerBlock onSend={(data) => console.log(data)} />`,
  },
  {
    id: "invoice-builder",
    name: "Invoice & quote builder",
    description:
      "Editable invoice details and line items with optional send and download actions.",
    category: "Operations & Commerce",
    icon: "printer",
    file: "InvoiceQuoteBuilderBlock.tsx",
    dependencies: ["blocks/LineItemsBlock.tsx", "components/index.ts"],
    background: "#f0edf3",
    tag: "Commerce",
    usage: `import { InvoiceQuoteBuilderBlock } from './blocks/InvoiceQuoteBuilderBlock';\n\n<InvoiceQuoteBuilderBlock onSendInvoice={(invoice) => console.log(invoice.invoiceNumber)} />`,
  },
  {
    id: "order-fulfillment",
    name: "Order fulfillment tracker",
    description: "Order status, shipment details, and package items.",
    category: "Operations & Commerce",
    icon: "clock",
    file: "OrderFulfillmentBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#ebf2ee",
    usage: `import { OrderFulfillmentBlock } from './blocks/OrderFulfillmentBlock';\n\n<OrderFulfillmentBlock />`,
  },
  {
    id: "team-management",
    name: "User & team management",
    description:
      "Team roster with role selection, invitation callback, and removal confirmation.",
    category: "Operations & Commerce",
    icon: "users",
    file: "UserTeamManagementBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#f4f1e6",
    usage: `import { UserTeamManagementBlock } from './blocks/UserTeamManagementBlock';\n\n<UserTeamManagementBlock />`,
  },
  {
    id: "billing-subscription",
    name: "Billing & subscriptions",
    description: "Current plan, payment method, and invoice history.",
    category: "Operations & Commerce",
    icon: "wallet",
    file: "BillingSubscriptionBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#eaf0ed",
    usage: `import { BillingSubscriptionBlock } from './blocks/BillingSubscriptionBlock';\n\n<BillingSubscriptionBlock />`,
  },
  {
    id: "data-export",
    name: "Data export & share sheet",
    description: "Choose an export format, record selection, and fields.",
    category: "Operations & Commerce",
    icon: "download",
    file: "DataExportShareBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#f0efe8",
    usage: `import { DataExportShareBlock } from './blocks/DataExportShareBlock';\n\n<DataExportShareBlock totalRecords={120} filteredRecords={24} onExport={(fmt) => console.log(fmt)} />`,
  },
  {
    id: "empty-state",
    name: "Empty state block",
    description: "A clear empty state with optional next actions.",
    category: "Feedback & States",
    icon: "spark",
    file: "EmptyStateBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#f1eee8",
    usage: `import { EmptyStateBlock } from './blocks/EmptyStateBlock';\n\n<EmptyStateBlock title="No projects yet" onAction={() => {}} />`,
  },
  {
    id: "error-state",
    name: "404 & error state block",
    description: "A concise error message with recovery actions.",
    category: "Feedback & States",
    icon: "alertTriangle",
    file: "ErrorStateBlock.tsx",
    dependencies: ["components/index.ts"],
    background: "#faede9",
    usage: `import { ErrorStateBlock } from './blocks/ErrorStateBlock';\n\n<ErrorStateBlock code="404" title="Page not found" onHome={() => {}} />`,
  },
  {
    id: "gstin-input",
    name: "GSTIN tax identifier",
    description:
      "Indian GSTIN 15-character validator with state and PAN breakdown.",
    category: "Forms & Workflows",
    icon: "shield",
    file: "GSTINInput.tsx",
    dependencies: ["components/index.ts"],
    background: "#eff2e8",
    usage: `import { GSTINInput } from './blocks/GSTINInput';\n\n<GSTINInput value="29AABCU9603R1ZM" onChange={() => {}} />`,
  },
  {
    id: "upi-qr",
    name: "UPI QR instant collect",
    description: "Dynamic SVG QR payment block with VPA copy and intent links.",
    category: "Operations & Commerce",
    icon: "wallet",
    file: "UPIQR.tsx",
    dependencies: ["components/index.ts", "react-native-svg"],
    background: "#f0f2eb",
    usage: `import { UPIQR } from './blocks/UPIQR';\n\n<UPIQR upiId="billing@hdfcbank" amount="24,500.00" />`,
  },
  {
    id: "einvoice-qr",
    name: "E-Invoice compliance",
    description:
      "Invoice Reference Number (IRN) verification with NIC digital signature.",
    category: "Operations & Commerce",
    icon: "file",
    file: "EInvoiceQR.tsx",
    dependencies: ["components/index.ts", "react-native-svg"],
    background: "#f3f5ee",
    usage: `import { EInvoiceQR } from './blocks/EInvoiceQR';\n\n<EInvoiceQR irn="8f3b201a..." documentNumber="INV/2026/0491" />`,
  },
  {
    id: "cheque-fields",
    name: "Cheque & DD instrument",
    description:
      "Bank instrument capture with cheque number, IFSC, and clearing status.",
    category: "Operations & Commerce",
    icon: "wallet",
    file: "ChequeFields.tsx",
    dependencies: ["components/index.ts"],
    background: "#f2f5ec",
    usage: `import { ChequeFields } from './blocks/ChequeFields';\n\n<ChequeFields value={{ bankName: 'SBI', chequeNumber: '004812', ifscCode: 'SBIN0001234', chequeDate: '2026-10-15', amount: '50,000.00', status: 'cleared' }} onChange={() => {}} />`,
  },
  {
    id: "payment-poller",
    name: "Payment status poller",
    description: "Live async webhook verification card with attempt countdown.",
    category: "Operations & Commerce",
    icon: "refresh",
    file: "PaymentStatusPoller.tsx",
    dependencies: ["components/index.ts"],
    background: "#f4f6ef",
    usage: `import { PaymentStatusPoller } from './blocks/PaymentStatusPoller';\n\n<PaymentStatusPoller status="polling" transactionId="TXN-2026-94812" amount="₹14,250.00" />`,
  },
  {
    id: "salary-slip",
    name: "Salary slip ledger",
    description:
      "Payroll compensation breakdown with earnings, deductions, and PDF export.",
    category: "Operations & Commerce",
    icon: "chart",
    file: "SalarySlipItem.tsx",
    dependencies: ["components/index.ts"],
    background: "#eff2e8",
    usage: `import { SalarySlipItem } from './blocks/SalarySlipItem';\n\n<SalarySlipItem monthYear="October 2026" employeeName="Vikram Aditya" netPayable="₹79,600.00" />`,
  },
  {
    id: "expense-claim",
    name: "Expense claim summary",
    description:
      "Voucher reconciliation with receipt counts and approval workflow.",
    category: "Operations & Commerce",
    icon: "file",
    file: "ExpenseClaimSummary.tsx",
    dependencies: ["components/index.ts"],
    background: "#f5f6f2",
    usage: `import { ExpenseClaimSummary } from './blocks/ExpenseClaimSummary';\n\n<ExpenseClaimSummary claimNumber="EXP-2026-0812" totalClaimed="₹18,450.00" />`,
  },
  {
    id: "employee-checkin",
    name: "Staff check-in log",
    description:
      "Field operations check-in with GPS geostamp and working hours.",
    category: "Operations & Commerce",
    icon: "home",
    file: "EmployeeCheckinItem.tsx",
    dependencies: ["components/index.ts"],
    background: "#f0f2eb",
    usage: `import { EmployeeCheckinItem } from './blocks/EmployeeCheckinItem';\n\n<EmployeeCheckinItem staffName="Ramesh Kumar" duration="9h 24m" />`,
  },
  {
    id: "employee-advance",
    name: "Employee advance ledger",
    description:
      "Salary advance loan balance with payroll EMI deduction progress.",
    category: "Operations & Commerce",
    icon: "wallet",
    file: "EmployeeAdvanceBalance.tsx",
    dependencies: ["components/index.ts"],
    background: "#f2f5ec",
    usage: `import { EmployeeAdvanceBalance } from './blocks/EmployeeAdvanceBalance';\n\n<EmployeeAdvanceBalance totalAdvance="₹30,000.00" balanceOutstanding="₹10,000.00" repaymentPercent={67} />`,
  },
  {
    id: "order-cart",
    name: "Wholesale order cart",
    description:
      "B2B order line items with quantity steppers, tax, and CartPeekBar.",
    category: "Operations & Commerce",
    icon: "wallet",
    file: "OrderCart.tsx",
    dependencies: ["components/index.ts"],
    background: "#edf1ea",
    usage: `import { OrderCart } from './blocks/OrderCart';\n\n<OrderCart items={[{ id: '1', sku: 'BRG-1', name: 'Ball Bearing', unitPrice: 450, quantity: 10 }]} />`,
  },
  {
    id: "stock-summary",
    name: "Warehouse stock summary",
    description:
      "On-hand, reserved, and ATP inventory with bin location breakdown.",
    category: "Operations & Commerce",
    icon: "layers",
    file: "StockSummary.tsx",
    dependencies: ["components/index.ts"],
    background: "#eff2e8",
    usage: `import { StockSummary } from './blocks/StockSummary';\n\n<StockSummary sku="BRG-6204-2RS" onHand={1420} allocated={380} safetyStock={500} />`,
  },
  {
    id: "suggested-order",
    name: "Predictive reorder strip",
    description:
      "Stockout runout forecast with daily velocity and 1-click PO addition.",
    category: "Operations & Commerce",
    icon: "spark",
    file: "SuggestedOrderStrip.tsx",
    dependencies: ["components/index.ts"],
    background: "#f7f8f4",
    usage: `import { SuggestedOrderStrip } from './blocks/SuggestedOrderStrip';\n\n<SuggestedOrderStrip sku="HYD-HSE-050" runoutDays={4} dailyVelocity={38} suggestedQuantity={400} />`,
  },
  {
    id: "bin-scan",
    name: "Bin scan verification",
    description: "Warehouse barcode match verification with mismatch alerts.",
    category: "Operations & Commerce",
    icon: "grid",
    file: "BinScanConfirm.tsx",
    dependencies: ["components/index.ts"],
    background: "#edf1ea",
    usage: `import { BinScanConfirm } from './blocks/BinScanConfirm';\n\n<BinScanConfirm targetBin="BIN-B-04-18" scannedBin="BIN-B-04-18" status="matched" />`,
  },
  {
    id: "trip-board",
    name: "Fleet dispatch board",
    description:
      "Active transport trips board with status filters and driver ETA.",
    category: "Operations & Commerce",
    icon: "layers",
    file: "TripBoard.tsx",
    dependencies: ["components/index.ts"],
    background: "#f0f2eb",
    usage: `import { TripBoard } from './blocks/TripBoard';\n\n<TripBoard />`,
  },
  {
    id: "trip-header",
    name: "Trip detail header",
    description:
      "Route milestones, telematics, driver contacts, and manifest action.",
    category: "Operations & Commerce",
    icon: "arrowRight",
    file: "TripHeader.tsx",
    dependencies: ["components/index.ts"],
    background: "#f3f5ee",
    usage: `import { TripHeader } from './blocks/TripHeader';\n\n<TripHeader tripNumber="TRP-2026-0914" origin="BLR Hub" destination="Chennai Port" />`,
  },
  {
    id: "tracking-status",
    name: "Shipment tracking transit",
    description:
      "Multi-checkpoint transit milestone tracker with live status nodes.",
    category: "Operations & Commerce",
    icon: "checkCircle",
    file: "TrackingStatusBar.tsx",
    dependencies: ["components/index.ts"],
    background: "#f2f5ec",
    usage: `import { TrackingStatusBar } from './blocks/TrackingStatusBar';\n\n<TrackingStatusBar awbNumber="AWB-894102914" carrier="Apex Freight" />`,
  },
  {
    id: "stop-header",
    name: "Route delivery stop",
    description:
      "Consignee address, contact, special instructions, and arrival windows.",
    category: "Operations & Commerce",
    icon: "home",
    file: "StopHeader.tsx",
    dependencies: ["components/index.ts"],
    background: "#eff2e8",
    usage: `import { StopHeader } from './blocks/StopHeader';\n\n<StopHeader stopNumber={3} totalStops={8} consigneeName="Precision Hydraulics" />`,
  },
  {
    id: "ticket-stats",
    name: "Support SLA & ticket stats",
    description:
      "Queue metrics, SLA compliance, response times, and priority tiers.",
    category: "Dashboard & Records",
    icon: "chart",
    file: "TicketStats.tsx",
    dependencies: ["components/index.ts"],
    background: "#edf1ea",
    usage: `import { TicketStats } from './blocks/TicketStats';\n\n<TicketStats totalOpen={42} slaResolutionRate={96.8} avgFirstResponse="14 mins" />`,
  },
  {
    id: "workflow-sheet",
    name: "Workflow transition sheet",
    description:
      "Multi-state approval actions with mandatory rationale remarks.",
    category: "Forms & Workflows",
    icon: "edit",
    file: "WorkflowActionSheet.tsx",
    dependencies: ["components/index.ts"],
    background: "#f0f2eb",
    usage: `import { WorkflowActionSheet } from './blocks/WorkflowActionSheet';\n\n<WorkflowActionSheet recordTitle="CapEx Procurement Approval" recordId="REQ-2026-8941" />`,
  },
];
