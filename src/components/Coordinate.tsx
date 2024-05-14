import cx from "classnames";
import Error from "./Error";
import { useJsApiLoader, Libraries } from "@react-google-maps/api";
import React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { Input, Spinner } from "@nextui-org/react";
import { Button } from "./Button";
import { useActiveModal } from "src/stores/modalStore";
import {
  APIProvider,
  AdvancedMarker,
  Map,
  MapCameraChangedEvent,
  MapCameraProps,
} from "@vis.gl/react-google-maps";

export interface CoordinateProps {
  lat: number;
  lng: number;
}

export const defaultCoordinate = {
  lat: -5.135399,
  lng: 119.42379,
};

const libraries: Libraries = ["maps", "places"];

const Coordinate: React.FC<{
  setCoordinate: (e: CoordinateProps) => void;
  lat: number;
  lng: number;
  zoom?: number;
}> = (props) => {
  const [currentCoordinate, setCurrentCoordinate] =
    React.useState<CoordinateProps | null>(null);
  const [address, setAddress] = React.useState("");
  const [formattedAddress, setFormattedAddress] = React.useState("");

  const { actionIsCoordinate } = useActiveModal();
  const { isLoaded, loadError } = useMaps();

  const handleSearch = (newAddress: string) => setAddress(newAddress);
  const handleSelect = async (newAddress: string) => {
    try {
      const results = await geocodeByAddress(newAddress);
      const latlng = await getLatLng(results[0]);
      setCurrentCoordinate(latlng);
      setFormattedAddress(results[0].formatted_address);
    } catch (e) {
      const error = e as Error;
      console.error(`Error: ${error.message}`);
    }
  };

  const coordinate = {
    lat: props.lat,
    lng: props.lng,
  };

  return (
    <section>
      {loadError ? (
        <Error error="Error Maps" />
      ) : !isLoaded ? (
        <Spinner />
      ) : (
        <section className="flexcol gap-4">
          <PlacesAutocomplete
            value={address}
            onChange={handleSearch}
            onSelect={handleSelect}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div>
                <Input
                  {...getInputProps({ placeholder: "Cari Lokasi..." })}
                  labelPlacement="outside"
                  autoFocus
                />
                <div className="mt-4">
                  {loading && <Spinner />}
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
          <div className="flex flex-col gap-2">
            <APIProvider apiKey={import.meta.env.VITE_COORDINATE}>
              <div className="w-full h-[15rem] bg-yellow-300 flex">
                <Map
                  mapId={import.meta.env.VITE_COORDINATE}
                  defaultCenter={defaultCoordinate}
                  onClick={(e) => {
                    props.setCoordinate({
                      lat: e.detail.latLng?.lat ?? 0,
                      lng: e.detail.latLng?.lng ?? 0,
                    });

                    setCurrentCoordinate({
                      lat: e.detail.latLng?.lat ?? 0,
                      lng: e.detail.latLng?.lng ?? 0,
                    });
                  }}
                  center={
                    !props.lat
                      ? defaultCoordinate
                      : currentCoordinate ?? coordinate
                  }
                  zoom={props.zoom ?? 12}
                  disableDefaultUI
                >
                  {props.lat && (
                    <AdvancedMarker
                      position={currentCoordinate ?? coordinate}
                    />
                  )}
                </Map>
              </div>
            </APIProvider>

            {formattedAddress && (
              <p className="text-sm border border-gray-400 p-2 rounded-md">
                {formattedAddress}
              </p>
            )}
          </div>

          <Button
            label="pilih koordinat"
            className="mx-auto mt-2"
            onClick={() => {
              actionIsCoordinate();
              props.setCoordinate({
                lat: currentCoordinate?.lat ?? 0,
                lng: currentCoordinate?.lng ?? 0,
              });
            }}
          />
        </section>
      )}
    </section>
  );
};

export default Coordinate;

export interface UserCoordinateProps extends CoordinateProps {
  label?: string;
  cursor?: string;
  onClick?: () => void;
  zoom?: number;
}

export const UserCoordinate: React.FC<UserCoordinateProps> = (props) => {
  const { isLoaded } = useMaps();
  const coordinate = { lat: props.lat, lng: props.lng };

  const INITIAL_CAMERA = {
    center: coordinate,
    zoom: props.zoom ?? 12,
  };

  const [cameraProps, setCameraProps] =
    React.useState<MapCameraProps>(INITIAL_CAMERA);
  const handleCameraChange = (ev: MapCameraChangedEvent) =>
    setCameraProps(ev.detail);

  return (
    <section className="flex flex-col gap-4">
      {props.label && <h2 className="capitalize text-sm">{props.label}</h2>}
      {!isLoaded ? (
        <Spinner />
      ) : (
        <APIProvider apiKey={import.meta.env.VITE_COORDINATE}>
          <div className="w-full h-[10rem] bg-yellow-300 flex">
            <Map
              {...cameraProps}
              mapId={import.meta.env.VITE_COORDINATE}
              defaultCenter={defaultCoordinate}
              center={coordinate}
              onClick={props.onClick}
              onCameraChanged={handleCameraChange}
              disableDefaultUI
            >
              <AdvancedMarker position={coordinate} />
            </Map>
          </div>
        </APIProvider>
      )}
    </section>
  );
};

const useMaps = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_COORDINATE,
    libraries,
  });

  return { isLoaded, loadError };
};
