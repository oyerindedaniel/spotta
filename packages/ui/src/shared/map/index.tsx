"use client";

import {
  GoogleMap,
  OverlayView,
  OverlayViewF,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useCurrentLocation } from "@repo/hooks/src/use-current-location";
import { LatLng } from "@repo/types";
import { useCallback, useState } from "react";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_POLYLINE_OPTIONS,
  DEFAULT_ZOOM,
  MAP_CONTAINER_STYLES,
} from "./constants";
import MapInput, { MapInputProps } from "./input";

interface MapProps {
  children?: React.ReactNode;
  inputProps?: MapInputProps;
  polyLinePaths?: LatLng[];
  showUserLocation?: boolean;
  customPolyLineOptions?: Object;
  zoom?: number;
}

const Map = ({
  children,
  inputProps,
  polyLinePaths = [],
  customPolyLineOptions,
  showUserLocation = true,
  zoom,
}: MapProps) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
    libraries: ["places", "visualization", "drawing", "geometry"],
  });

  const [map, setMap] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<LatLng>(DEFAULT_MAP_CENTER);
  const [userLocation, setUserLocation] = useState<LatLng | null>();

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  useCurrentLocation({
    callback: (location) => {
      setMapCenter(location);
      setUserLocation(location);
    },
  });

  return (
    <div>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={MAP_CONTAINER_STYLES}
          center={mapCenter}
          zoom={zoom ?? DEFAULT_ZOOM}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <>
            {polyLinePaths.length > 1 && (
              <Polyline
                path={polyLinePaths}
                options={{
                  ...DEFAULT_POLYLINE_OPTIONS,
                  ...customPolyLineOptions,
                }}
              />
            )}
            {children}
            {showUserLocation && userLocation && (
              <OverlayViewF
                position={{ lat: userLocation.lat, lng: userLocation.lng }}
                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
              >
                <div className="relative p-8 cursor-pointer z-10">
                  <div className="absolute -top-4 -left-4 h-4 w-4 bg-red-500 rounded-full" />
                </div>
              </OverlayViewF>
            )}

            {inputProps && (
              <MapInput {...inputProps} setMapCenter={setMapCenter} />
            )}
          </>
        </GoogleMap>
      ) : (
        <span className="text-sm">Loading map ...</span>
      )}
    </div>
  );
};

export { Map };
