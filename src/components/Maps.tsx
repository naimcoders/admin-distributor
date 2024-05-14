import { APIProvider, AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import React from "react";
import usePlacesAutoComplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

// interface I

const Maps = () => {
  const [latLng, setLatLng] = React.useState<{ lat: number; lng: number }>({
    lat: 0,
    lng: 0,
  });

  const position = {
    lat: -5.135399,
    lng: 119.42379,
  };

  return (
    <APIProvider apiKey={import.meta.env.VITE_COORDINATE}>
      <div className="h-screen w-full">
        <Map
          defaultZoom={10}
          center={position}
          mapId={import.meta.env.VITE_COORDINATE}
          onClick={(e) => console.log(e)}
        >
          <AdvancedMarker position={position} />
        </Map>
      </div>
    </APIProvider>
  );
};

export default Maps;
