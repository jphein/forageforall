# QA Checklist — manual regression before releases

Run through this on a real device (not just the simulator) before every App Store / Play Store submission.

Budget: ~30 minutes on each platform.

## Smoke test
- [ ] App launches cold in under 3s
- [ ] No crash on first run (fresh install)
- [ ] No crash on upgrade from previous version
- [ ] Airplane mode → app still opens, shows cached pins, shows offline banner

## Auth
- [ ] Sign up with email → magic link arrives
- [ ] Tap magic link → returns to app authenticated
- [ ] Sign out → returns to unauthenticated state
- [ ] Delete account → data gone within 5 minutes

## Map
- [ ] Map loads centered on user location (with permission)
- [ ] Map loads centered on default city (without permission)
- [ ] Pin clusters at low zoom, expands at high zoom
- [ ] Tap pin → detail sheet slides up
- [ ] Pan → new pins load within 500ms
- [ ] Dark mode follows system by default

## Add listing
- [ ] Tap + → add flow starts
- [ ] Camera permission flow works
- [ ] Gallery permission flow works
- [ ] Species picker shows full catalog, searchable
- [ ] Toxicity warning blocks continue on hazardous species
- [ ] Submit → pin appears on map within 2s (real-time sync)
- [ ] Pin location is fuzzed (check DB directly)

## Listing detail
- [ ] Photos swipeable
- [ ] Ripeness ring reflects recent confirmations
- [ ] "Mark as gone" → confirms, updates ripeness
- [ ] "Confirm still here" → updates timestamp
- [ ] Flag pin → report sheet opens
- [ ] Share → deep link copies/shares

## Profile
- [ ] My pins list loads
- [ ] Saved pins list loads
- [ ] Stats accurate
- [ ] Settings → privacy defaults unchanged from fresh install

## Accessibility
- [ ] VoiceOver (iOS) / TalkBack (Android) reads every screen meaningfully
- [ ] Dynamic type scales up to XXL without layout breaks
- [ ] All interactive elements have ≥44pt hit targets
- [ ] Color contrast passes WCAG AA on critical text

## Privacy spot-checks
- [ ] No network calls to analytics domains (check with Proxyman/Charles)
- [ ] Stored coords are fuzzed in DB
- [ ] No secrets in bundle (grep the built .ipa/.apk)
- [ ] Info.plist permission strings are human-readable

## Store metadata
- [ ] Screenshots current, match latest design
- [ ] Keywords updated
- [ ] Description mentions AGPLv3 + open source
- [ ] Privacy manifest (iOS) matches PRIVACY.md

## Post-release
- [ ] Monitor GitHub issues for 48h
- [ ] Watch TestFlight / Play Console crash reports
- [ ] Tag the release in git with changelog
