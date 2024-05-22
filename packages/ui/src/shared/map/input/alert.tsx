import { cn } from "@/lib/utils";

export type MapAlertType = "success" | "warning" | "error";

const MapInputAlert = ({
  description,
  status,
}: {
  description: string;
  status: MapAlertType;
}) => {
  return (
    <div
      className={cn(
        status === "success" && "bg-green-300",
        status === "warning" && "bg-[#fde68a]",
        status === "error" && "bg-red-300",
        "h-8 p-1 mt-2 px-2 text-black"
      )}
    >
      <div>{description}</div>
    </div>
  );
};

export default MapInputAlert;
