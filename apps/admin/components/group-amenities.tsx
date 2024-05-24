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
    <div>
      {Object.entries(groupedAmenities).map(([name, count]) => (
        <Badge key={name}>
          {name} {count}
        </Badge>
      ))}
    </div>
  );
}

export default GroupedAmenities;
