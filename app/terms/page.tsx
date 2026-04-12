import { ScreenLayout } from "@/components/ScreenLayout";

export default function TermsPage() {
  return (
    <ScreenLayout title="Terms" subtitle="Short demo terms for this flow.">
      <div className="list">
        <p>By using PrintFlow, you confirm you have rights to print uploaded files.</p>
        <p>Orders are billed at submission time and can only be canceled before printing starts.</p>
        <p>Data is stored securely for job processing and deleted according to policy.</p>
      </div>
    </ScreenLayout>
  );
}
