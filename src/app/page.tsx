
import { DataTable } from "@/components/data-table";
import { columns } from "@/constants/columns/payments";
import { usePayments } from "@/hooks/usePayments";


export default function Home() {
  const { data } = usePayments();

  console.log("Payments data:", data);
  

  return (
    <div className="container mx-auto p-4 ">
      <div className="overflow-hidden rounded-lg">
        <DataTable
          columns={columns}
          data={data}
        />
      </div>
    </div>
  );
}
