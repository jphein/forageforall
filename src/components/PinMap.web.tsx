/**
 * Web pin-drop map — uses @react-google-maps/api. Picked by Metro when
 * bundling --platform web, so app/add.tsx never imports react-native-maps
 * on the web build.
 */

import React from "react";
import { View } from "react-native";
import {
  GoogleMap,
  useJsApiLoader,
  Marker as GMarker,
} from "@react-google-maps/api";

import { Text } from "./Text";
import { colors } from "../theme/tokens";

type Coord = { lat: number; lng: number };

type Props = {
  coord: Coord | null;
  onCoordChange: (c: Coord) => void;
  initialCenter: Coord;
};

const MAPS_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_WEB_KEY ?? "";

export function PinMap({ coord, onCoordChange, initialCenter }: Props) {
  const { isLoaded } = useJsApiLoader({ googleMapsApiKey: MAPS_KEY });

  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.bg,
        }}
      >
        <Text variant="body" muted>
          Loading map…
        </Text>
      </View>
    );
  }

  const center = coord
    ? { lat: coord.lat, lng: coord.lng }
    : { lat: initialCenter.lat, lng: initialCenter.lng };

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={center}
      zoom={15}
      onClick={(e) => {
        if (!e.latLng) return;
        onCoordChange({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      }}
      options={{
        disableDefaultUI: true,
        zoomControl: true,
        clickableIcons: false,
      }}
    >
      {coord ? (
        <GMarker
          position={{ lat: coord.lat, lng: coord.lng }}
          draggable
          onDragEnd={(e) => {
            if (!e.latLng) return;
            onCoordChange({ lat: e.latLng.lat(), lng: e.latLng.lng() });
          }}
        />
      ) : null}
    </GoogleMap>
  );
}
