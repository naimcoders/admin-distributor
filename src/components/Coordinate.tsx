import cx from "classnames";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Libraries,
} from "@react-google-maps/api";
import Error from "./Error";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { Input } from "@nextui-org/react";

const containerStyle: CSSProperties = {
  width: "400px",
  height: "300px",
  borderRadius: ".5rem",
};

const defaultCoordinate = {
  lat: -5.135399,
  lng: 119.42379,
};

const libraries: Libraries = ["places"];

const Coordinate = () => {
  const [address, setAddress] = useState("");
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const [latLngUser, setLatLngUser] = useState<{
    lat?: number;
    lng?: number;
  } | null>(null);

  const handleSearch = (newAddress: string) => {
    setAddress(newAddress);
  };

  const handleSelect = async (newAddress: string) => {
    try {
      const results = await geocodeByAddress(newAddress);
      const latlng = await getLatLng(results[0]);
      setLatLngUser(latlng);
    } catch (e) {
      const error = e as Error;
      console.error(`Error: ${error.message}`);
    }
  };

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_COORDINATE,
    libraries,
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
      setAddress("");
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
    return <div className="font-semibold">Loading Maps...</div>;
  }

  return (
    <section className="flexcol gap-5">
      {/* Search location */}
      <PlacesAutocomplete
        value={address}
        onChange={handleSearch}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <Input
              {...getInputProps({ placeholder: "Cari Lokasi..." })}
              labelPlacement="outside"
            />
            <div className="mt-4">
              {loading && <div className="font-semibold">Loading...</div>}
              {suggestions.map((suggestion) => (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className: cx(
                      "text-sm p-2 rounded-md",
                      suggestion.active
                        ? "bg-[#cacafe] cursor-pointer"
                        : "bg-white cursor-pointer"
                    ),
                  })}
                  key={suggestion.index}
                >
                  <span>{suggestion.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </PlacesAutocomplete>

      {/* Maps */}
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
    </section>
  );
};

export default Coordinate;
