import cx from "classnames";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Libraries,
} from "@react-google-maps/api";
import Error from "./Error";
import { CSSProperties, FC, useCallback, useEffect, useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { Input } from "@nextui-org/react";
import useGeneralStore from "src/stores/generalStore";
import { Button } from "./Button";
import { useActiveModal } from "src/stores/modalStore";

export interface CoordinateProps {
  lat: number;
  lng: number;
}

const containerStyle: CSSProperties = {
  width: "400px",
  height: "300px",
  borderRadius: ".5rem",
};

const defaultCoordinate = {
  lat: -5.135399,
  lng: 119.42379,
};

const libraries: Libraries = ["maps", "places"];

const Coordinate = () => {
  const [address, setAddress] = useState("");
  const [formattedAddress, setFormattedAddress] = useState("");
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [currentCoordinate, setCurrentCoordinate] =
    useState<CoordinateProps | null>(null);

  const { actionIsCoordinate } = useActiveModal();
  const coordinate = useGeneralStore((v) => v.coordinate);
  const setCoordinate = useGeneralStore((v) => v.setCoordinate);

  const handleSearch = (newAddress: string) => setAddress(newAddress);
  const handleSelect = async (newAddress: string) => {
    try {
      const results = await geocodeByAddress(newAddress);
      const latlng = await getLatLng(results[0]);

      setCurrentCoordinate({ lat: latlng.lat, lng: latlng.lng });
      setFormattedAddress(results[0].formatted_address);
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
    setMap(map);

    // get coordinate user
    map.addListener("click", (e: google.maps.MapMouseEvent) => {
      const lat = e.latLng?.lat()!;
      const lng = e.latLng?.lng()!;
      setCurrentCoordinate({ lat, lng });
      setAddress("");
    });
  }, []);

  const onUnmount = useCallback(() => setMap(null), []);

  const closeModal = () => {
    setCoordinate(currentCoordinate!);
    actionIsCoordinate();
  };

  useEffect(() => {
    if (map && coordinate) {
      map.panTo({ lat: coordinate.lat!, lng: coordinate.lng! });
    }
  }, [map, coordinate]);

  if (loadError) {
    return <Error error="Error Loading Maps" />;
  }

  if (!isLoaded) {
    return <div className="font-semibold">Loading Maps...</div>;
  }

  return (
    <section className="flexcol gap-4">
      {/* search location */}
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
              autoFocus
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

      {/* maps */}
      <div className="flexcol gap-2">
        <GoogleMap
          mapContainerStyle={containerStyle}
          zoom={10}
          center={defaultCoordinate}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {currentCoordinate && (
            <Marker
              position={{
                lat: currentCoordinate.lat,
                lng: currentCoordinate.lng,
              }}
            />
          )}
        </GoogleMap>

        {formattedAddress && (
          <p className="text-sm border border-gray-400 p-2 rounded-md">
            {formattedAddress}
          </p>
        )}
      </div>

      <Button
        aria-label="pilih koordinat"
        className="mx-auto mt-2"
        onClick={closeModal}
      />
    </section>
  );
};

export default Coordinate;

export interface UserCoordinateProps extends CoordinateProps {
  label: string;
  onClick?: () => void;
}

export const UserCoordinate: FC<UserCoordinateProps> = ({
  label,
  lat,
  lng,
  onClick,
}) => {
  const coordinate = { lat, lng };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_COORDINATE,
    libraries,
  });

  return (
    <section className="flexcol gap-4">
      <h2 className="capitalize text-sm">{label}</h2>
      {!isLoaded ? (
        <div className="font-semibold text-base">Loading...</div>
      ) : (
        <div className="relative">
          <GoogleMap
            zoom={10}
            center={coordinate}
            mapContainerStyle={{
              width: "100%",
              aspectRatio: 16 / 9,
              borderRadius: ".5rem",
            }}
            options={{
              draggableCursor: "pointer",
              fullscreenControl: false,
            }}
            onClick={onClick}
          >
            {coordinate && <Marker position={coordinate} />}
          </GoogleMap>
        </div>
      )}
    </section>
  );
};
