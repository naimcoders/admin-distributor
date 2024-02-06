import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import Error from "./Error";
import { useCallback, useEffect, useState } from "react";

const containerStyle = {
  width: "400px",
  height: "400px",
};

const defaultCoordinate = {
  lat: -5.135399,
  lng: 119.42379,
};

const Coordinate = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [latLngUser, setLatLngUser] = useState<{
    lat?: number;
    lng?: number;
  } | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_COORDINATE,
  });

  const onLoad = useCallback((map: google.maps.Map): void => {
    const bounds = new window.google.maps.LatLngBounds(defaultCoordinate);
    map.fitBounds(bounds);
    setMap(map);

    // get coordinate user
    map.addListener("click", (e: google.maps.MapMouseEvent) => {
      const lat = e.latLng?.lat();
      const lng = e.latLng?.lng();
      setLatLngUser({ lat, lng });
    });
  }, []);

  const onUnmount = useCallback(() => setMap(null), []);

  useEffect(() => {
    if (map && latLngUser) {
      map.panTo({ lat: latLngUser.lat!, lng: latLngUser.lng! });
    }
  }, [map, latLngUser]);

  if (loadError) {
    return <Error error="Error Loading Maps" />;
  }

  if (!isLoaded) {
    return <div>Loading Maps...</div>;
  }

  return (
    <>
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={10}
        center={defaultCoordinate}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {latLngUser && (
          <Marker position={{ lat: latLngUser.lat!, lng: latLngUser.lng! }} />
        )}
      </GoogleMap>
    </>
  );
};

export default Coordinate;
