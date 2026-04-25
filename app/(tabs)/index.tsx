/**
 * Thin route wrapper — Metro picks MapScreen.tsx on native and
 * MapScreen.web.tsx on web. The screen body lives in src/screens/ so
 * expo-router's require.context doesn't pull both variants into the
 * bundle (its regex matches .tsx AND .web.tsx as sibling routes).
 */
export { default } from "../../src/screens/MapScreen";
