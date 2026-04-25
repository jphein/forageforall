/**
 * Native pin-drop map — wraps react-native-maps. Shares the step-0 map
 * UX with app/add.tsx. The `.web.tsx` sibling uses @react-google-maps/api
 * so Metro never resolves react-native-maps on web (which would drag in
 * react-native's native renderer internals and break the web bundle).
 */

import React from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { FORAGE_PAPER_STYLE } from "../config/mapStyles";

type Coord = { lat: number; lng: number };

type Props = {
  coord: Coord | null;
  onCoordChange: (c: Coord) => void;
  initialCenter: Coord;
};

export function PinMap({ coord, onCoordChange, initialCenter }: Props) {
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={{ flex: 1 }}
      customMapStyle={FORAGE_PAPER_STYLE}
      initialRegion={{
        latitude: initialCenter.lat,
        longitude: initialCenter.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      onPress={(e) =>
        onCoordChange({
          lat: e.nativeEvent.coordinate.latitude,
          lng: e.nativeEvent.coordinate.longitude,
        })
      }
      showsUserLocation
    >
      {coord ? (
        <Marker
          coordinate={{ latitude: coord.lat, longitude: coord.lng }}
          draggable
          onDragEnd={(e) =>
            onCoordChange({
              lat: e.nativeEvent.coordinate.latitude,
              lng: e.nativeEvent.coordinate.longitude,
            })
          }
        />
      ) : null}
    </MapView>
  );
}
