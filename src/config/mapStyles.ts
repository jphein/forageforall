/**
 * Google Maps customMapStyle JSON — Paper, Dark, and a Satellite-label hint.
 * Pass one to <MapView customMapStyle={...} />.
 *
 * Matches the Forage design palette in src/theme/tokens.ts.
 */

export const FORAGE_PAPER_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#EFE6CC" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6B5440" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#F4EDDC" }, { weight: 2 }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },

  { featureType: "administrative", elementType: "geometry.stroke",
    stylers: [{ color: "#C9B891" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill",
    stylers: [{ color: "#3E2E1F" }] },
  { featureType: "administrative.neighborhood", elementType: "labels.text.fill",
    stylers: [{ color: "#6B5440" }] },

  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "poi.business", stylers: [{ visibility: "off" }] },

  { featureType: "poi.park", elementType: "geometry",
    stylers: [{ color: "#B8C89A" }] },
  { featureType: "poi.park", elementType: "labels.text.fill",
    stylers: [{ color: "#3E4F30" }] },

  { featureType: "road", elementType: "geometry",
    stylers: [{ color: "#FBF5E3" }] },
  { featureType: "road", elementType: "geometry.stroke",
    stylers: [{ color: "#D4C49E" }, { weight: 0.6 }] },
  { featureType: "road.arterial", elementType: "geometry",
    stylers: [{ color: "#FFFAEC" }] },
  { featureType: "road.highway", elementType: "geometry",
    stylers: [{ color: "#F4DFA8" }] },
  { featureType: "road.highway", elementType: "geometry.stroke",
    stylers: [{ color: "#B8573A" }, { weight: 0.8 }] },
  { featureType: "road", elementType: "labels.text.fill",
    stylers: [{ color: "#6B5440" }] },

  { featureType: "transit", elementType: "labels", stylers: [{ visibility: "simplified" }] },
  { featureType: "transit.station", stylers: [{ visibility: "off" }] },

  { featureType: "water", elementType: "geometry",
    stylers: [{ color: "#A9C5C7" }] },
  { featureType: "water", elementType: "labels.text.fill",
    stylers: [{ color: "#2F5560" }] },
];

export const FORAGE_DARK_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#1C1A14" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#A6946F" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0F0E0A" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },

  { featureType: "administrative.locality", elementType: "labels.text.fill",
    stylers: [{ color: "#D4C49E" }] },

  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry",
    stylers: [{ color: "#2A3A22" }] },
  { featureType: "poi.park", elementType: "labels.text.fill",
    stylers: [{ color: "#6E9457" }] },

  { featureType: "road", elementType: "geometry",
    stylers: [{ color: "#2A251B" }] },
  { featureType: "road.highway", elementType: "geometry",
    stylers: [{ color: "#4A3A23" }] },

  { featureType: "transit", elementType: "labels", stylers: [{ visibility: "off" }] },

  { featureType: "water", elementType: "geometry",
    stylers: [{ color: "#1A2A2E" }] },
  { featureType: "water", elementType: "labels.text.fill",
    stylers: [{ color: "#6E8A90" }] },
];

export const MAP_STYLES = {
  paper: FORAGE_PAPER_STYLE,
  dark: FORAGE_DARK_STYLE,
  // Satellite uses Google's default imagery — pass mapType="hybrid", no customMapStyle.
  satellite: null,
} as const;

export type MapStyleKey = keyof typeof MAP_STYLES;
