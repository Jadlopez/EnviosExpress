import { useMapEvents } from "react-leaflet";

export default function ClickHandler({
  editable = false,
  selecting = "origen",
  onSelect,
}) {
  useMapEvents({
    click(e) {
      if (!editable) return;

      if (!onSelect) return;

      const { lat, lng } = e.latlng;

      onSelect(lat, lng, selecting);
    },
  });

  return null;
}
