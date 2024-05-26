import { Badge } from "@repo/ui";

type GroupedAmenitiesProps = {
  groupedAmenities: Record<string, number>;
};

/**
 * Component to render badges for each amenity with its count.
 * @param {GroupedAmenitiesProps} props - The props for the component.
 * @returns {JSX.Element} - The JSX element containing badges for each amenity.
 */
function GroupedAmenities({
  groupedAmenities,
}: GroupedAmenitiesProps): JSX.Element {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {Object.entries(groupedAmenities).map(([name, count]) => (
        <Badge key={name} className="flex items-center gap-2">
          <span>{name}</span>
          <span className="flex h-3 w-3 items-center justify-center rounded-full bg-green-400 p-2 text-[9px] text-white">
            {count}
          </span>
        </Badge>
      ))}
    </div>
  );
}

export default GroupedAmenities;
