"use client";

import { useCallback, useEffect, useState } from "react";

import { LatLng } from "@repo/types";
import { useToast } from "@repo/ui";

interface UseCurrentLocation {
  latitude: number;
  longitude: number;
  getCurrentLocation: () => LatLng | null;
}

interface UseCurrentLocationProps {
  callback: (location: LatLng) => void;
}

export const useCurrentLocation = ({
  callback,
}: UseCurrentLocationProps): UseCurrentLocation => {
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();

  const { toast } = useToast();

  const getCurrentLocation = useCallback(() => {
    if ("geolocation" in navigator) {
      let location: LatLng | null = null;
      navigator.geolocation.getCurrentPosition((position) => {
        location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setLatitude(location.lat);
        setLongitude(location.lng);
        callback(location);
      });

      return location;
    } else {
      toast({
        variant: "info",
        title: "Your location couldn't be detected",
      });
    }

    return null;
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return { latitude: latitude!, longitude: longitude!, getCurrentLocation };
};
