import { useRef, useEffect, useContext, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { DataContext } from "../context/Context";

export const Map = () => {
  const [mapInfo, setMapInfo] = useState(null);
  const { coordinates, getRouteInfo } = useContext(DataContext);
  const mapContainerRef = useRef();
  const mapRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiYnVpbGRkdWRlIiwiYSI6ImNtbms4bTg5czBubjMycHFybjJ6OXlvbzkifQ.1ZXXfIP8Z3Ee_YSJ-GtQZQ";

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/builddude/cmnkaxe5a004j01sae913d904",
      center: [3.340787, 6.5960605],
      zoom: 12,
    });

    mapRef.current = map;

    return () => map.remove();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !coordinates?.current || !coordinates?.destination) return;

    const getRoute = async () => {
      const start = coordinates.current[0];
      const end = coordinates.destination[0];

      if (!start || !end) return;

      try {
        const query = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${start?.lon},${start?.lat};${end?.lon},${end?.lat}?steps=false&annotations=distance%2Cduration&geometries=geojson&access_token=${mapboxgl.accessToken}`,
        );
        const json = await query.json();
        const data = json.routes[0];

        setMapInfo(data);

        const distanceKm = (data.distance / 1000).toFixed(1);
        const hours = parseInt(Math.floor(data.duration / 3600));
        const minutes = parseInt(Math.floor((data.duration % 3600) / 60));
        const duration = hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;
        getRouteInfo(parseInt(distanceKm), duration);

        const geojson = {
          type: "Feature",
          properties: {},
          geometry: data.geometry,
        };

        if (!map.isStyleLoaded()) {
          map.once("style.load", () => updateMapSource(map, geojson));
        } else {
          updateMapSource(map, geojson);
        }

        map.flyTo({ center: start, zoom: 13 });
      } catch (error) {
        console.error("Route fetching error:", error);
      }
      new mapboxgl.Marker().setLngLat(start).addTo(map);

      new mapboxgl.Marker().setLngLat(end).addTo(map);
    };

    getRoute();
  }, [coordinates]);

  const updateMapSource = (map, geojson) => {
    if (map.getSource("route")) {
      map.getSource("route").setData(geojson);
    } else {
      map.addLayer({
        id: "route",
        type: "line",
        source: { type: "geojson", data: geojson },
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#6dbb71", "line-width": 10, "line-opacity": 1 },
      });
    }
  };

  useEffect(() => {
    if (coordinates?.current && coordinates?.destination) {
      // This scrolls specifically to the map div
      mapContainerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center", // Aligns the top of the map with the top of the screen
      });
    }
  }, [coordinates]);

  return <div id="map-container" ref={mapContainerRef} />;
};
