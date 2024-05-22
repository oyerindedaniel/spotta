import { Autocomplete } from "@react-google-maps/api";
import { LatLng } from "@repo/types";
import { useMemo, useRef } from "react";
import { Input } from "../../../components/ui/input";
import MapInputAlert, { MapAlertType } from "./alert";

type coordinates = { longitude?: number; latitude?: number; address?: string };

export interface MapInputProps {
  setMapCenter?: (latLng: LatLng) => void;
  onChange: (latLng: coordinates) => void;
  value: coordinates;
}

const MapInput = ({
  setMapCenter,
  onChange,
  value,
  ...rest
}: MapInputProps) => {
  const autoComplete = useRef<any>(null);

  const onPlaceChanged = () => {
    if (autoComplete.current !== null) {
      const place = autoComplete.current.getPlace();
      const address = place?.name || place?.formatted_address;

      const newLat = place?.geometry?.location?.lat() || 0;
      const newLng = place?.geometry?.location?.lng() || 0;

      setMapCenter?.({ lat: newLat, lng: newLng });
      onChange({ latitude: newLat, longitude: newLng, address });
    }
  };

  const { latitude, longitude } = value || {};

  const alertDetails = useMemo<{
    status: MapAlertType;
    text: string;
  }>(() => {
    if (!latitude) {
      return {
        status: "warning",
        text: "Waiting to get Map details",
      };
    }
    return {
      status: "success",
      text: "Map detail successfully gotten",
    };
  }, [latitude]);

  return (
    <div>
      <Autocomplete
        onLoad={(ref) => (autoComplete.current = ref)}
        onPlaceChanged={onPlaceChanged}
      >
        <div className="absolute top-2 mt-12 w-full px-4">
          <Input className="shadow-lg" {...rest} name="address" />

          <MapInputAlert
            description={alertDetails.text}
            status={alertDetails.status}
          />
        </div>
      </Autocomplete>
    </div>
  );
};

export default MapInput;
